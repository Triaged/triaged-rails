class Github::SetupService
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def initialize company_id
		@company = Company.find(company_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
	end

	def fetch_remote_organizations
		setup_personal_account
		setup_organizations

		github_orgs = @company.provider_accounts.provided_by(Provider.named "github")

		# Set account to default if only 1 exists, this will only be a personal account
		if (github_orgs.count == 1)
			github_orgs.first.set_default_account!
			create_hooks!
		end

		return github_orgs
	end

	def setup_organizations
		organizations = @github.orgs.all.to_a
		Rails.logger.info organizations
		
		organizations.each do |org|
			@company.provider_accounts.find_or_create_by(
				external_id: org.id, 
				name: org.login, 
				url: org.url,
				provider: Provider.named("github")
			)
		end
	end

	def setup_personal_account
		user_account = @github.users.get
		@company.provider_accounts.find_or_create_by(
			external_id: user_account.id, 
			name: user_account.login, 
			url: user_account.html_url,
			provider: Provider.named("github")
		)
	end

end