class Appfigures::BaseService

	attr_accessor :company

	def initialize company_id
		@company = Company.find(company_id)
		RestClient.log = Rails.logger
	end

	def headers
		headers = { :authorization => 
			"OAuth oauth_signature_method=PLAINTEXT," \
			"oauth_consumer_key=#{ENV['APPFIGURES_CLIENT_ID']}," \
			"oauth_token=#{@company.appfigures_provider_credentials.access_token},"\
			"oauth_signature=#{ENV['APPFIGURES_SECRET_ID']}&#{@company.appfigures_provider_credentials.refresh_token}"
		}
	end
end