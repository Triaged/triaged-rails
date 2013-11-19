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

		# Set account to default if only 1 exists
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
		return true
	end

	def create_hooks!
		save_repos
		create_repo_hooks
	end
	
	def save_repos
		# Get all repos for the org
		org = @company.default_github_org
		res = @github.repos.list org: org.name
		res.each_page { |page| page.each do |repo|
			org.provider_properties << Github::Repo.new(
				external_id: repo.id, 
				html_url: repo.html_url, 
				url: repo.url, 
				name: repo.name,
				full_name: repo.full_name,
				owner: repo.owner.login
			)
		end }
	end

	def create_repo_hooks
		@company.default_github_org.provider_properties.each do |repo|
			begin
				Rails.logger.info repo.name
				@github.repos.hooks.create repo.owner, repo.name, name: "web", active:  true, 
					config: { "url" => webhook_github_url(:id => @company.slug, :protocol => "https")}, 
					events: ["push", "issues", "issue_comment", "pull_request", "commit_comment"]
			rescue Github::Error::UnprocessableEntity => e
				Rails.logger.info e
				next
			rescue Github::Error::NotFound
				Rails.logger.info "repo not found"
				next
			end
		end
	end
end