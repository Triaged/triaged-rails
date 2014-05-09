class Heroku::AccountService < Heroku::BaseService
	
	def fetch_accounts
		accounts = []

		return accounts
	end

	#
	### Properties
	#
	def fetch_properties(account)
		tries ||= 3
		# Get all repos for the org
		apps = @heroku.app.list
		apps.each do |app|
			account.provider_properties << ProviderProperty.new(
				external_id: app.id.to_s, 
				url: app.web_url, 
				name: app.name,
			)
		end
	rescue Excon::Errors::Unauthorized
		#TODO : refresh token
		retry unless (tries -= 1).zero?
	end


	

	

end