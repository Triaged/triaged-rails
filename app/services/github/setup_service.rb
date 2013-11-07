class Github::SetupService
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def initialize company_id
		@company = Company.find(company_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
	end

	def fetch_remote_organizations
		Rails.logger.info "fetching remote"
		Rails.logger.info @company
		organizations = @github.orgs.all.to_a
		Rails.logger.info organizations
		organizations.each do |org|
			org = Github::Org.create(external_id: org.id, name: org.login, url: org.url, company: @company)
			Rails.logger.info org.inspect
		end

				# Set account to default if only 1 exists
		github_accounts = @company.provider_accounts.provided_by(Provider.named "github")
		github_accounts.first.set_default_account! if (ga_accounts.count == 1)

		create_hooks!

		return github_accounts
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
			Github::Repo.create(
				org: org, 
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
		Rails.logger.info (services_github_index_url(:subdomain => @company.slug))
		@company.default_github_org.repos.each do |repo|
			begin
				Rails.logger.info repo.name
				@github.repos.hooks.create repo.owner, repo.name, name: "web", active:  true, 
					config: { "url" => services_github_index_url(subdomain: @company.slug)}, 
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