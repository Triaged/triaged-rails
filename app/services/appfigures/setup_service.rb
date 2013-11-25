class Appfigures::SetupService
	include Sidekiq::Worker

	def perform company_id
		company = Company.find(company_id)
		
		user = RestClient.get "https://api.appfigures.com/v2/", headers(company)
		user = JSON.parse(user)
		
		account = RestClient.get "https://api.appfigures.com/v2/users/#{user["user"]["email"]}", headers(company)
		account = JSON.parse(account)
		build_account(company, account["account"])

	end

	def build_account company, account
		account = RecursiveOpenStruct.new(account)
		company.provider_accounts.create(name: account.company, external_id: account.id)
	end

	def headers(company)
		headers = { :authorization => 
			"OAuth oauth_signature_method=PLAINTEXT," \
			"oauth_consumer_key=#{ENV['APPFIGURES_CLIENT_ID']}," \
			"oauth_token=#{company.appfigures_provider_credentials.access_token},"\
			"oauth_signature=#{ENV['APPFIGURES_SECRET_ID']}&#{company.appfigures_provider_credentials.refresh_token}"
		}
	end

end