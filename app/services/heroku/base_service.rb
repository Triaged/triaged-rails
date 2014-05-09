class Heroku::BaseService

	attr_accessor :company, :heroku

	def initialize company_id, provider_credentials
		@company = Company.find(company_id)
		@heroku = PlatformAPI.connect_oauth provider_credentials.access_token
	end

end