# class Bitbucket::SetupService
# 	include Rails.application.routes.url_helpers

# 	attr_accessor :company, :github

# 	def initialize bitbucket
# 		@company = Company.find(company_id)
# 		credentials =  @company.github_provider_credentials
# 		@bitbucket = BitBucket.new oauth_token: credentials.access_token, oauth_secret: credentials.refresh_token
# 	end

# 	def fetch_remote_organizations
# 		user_account = @bitbucket.user_api.profile

# 		@company.provider_accounts.find_or_create_by(
# 			external_id: user_account.id, 
# 			name: user_account.login, 
# 			provider: Provider.named("github")
# 		)

# 		# Set account to default if only 1 exists, this will only be a personal account
		
# 			BitBucket::CreateHooks.perform_async(@company.id.to_s)
# 	end


# end