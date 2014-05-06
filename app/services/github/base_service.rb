class Github::BaseService

	attr_accessor :company, :github

	def initialize company_id, provider_credentials
		@company = Company.find(company_id)
		@github = Github.new oauth_token: provider_credentials.access_token
	end

end