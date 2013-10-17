class Github::Service
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def initialize company_id
		@company = Company.find(company_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
	end

	def fetch_remote_organizations
		Rails.logger.info "fetching remote"
		organizations = @github.orgs.all.to_a
		Rails.logger.info organizations
		organizations.each do |org|
			org = @company.github_organizations.create(
				external_id: org.id,
				name: org.login,
				url: org.url,
			)
			Rails.logger.info org.errors.inspect
			Rails.logger.info company.github_organizations
			Rails.logger.info company.errors.inspect
		end
		
		@company.default_github_org = @company.github_organizations.first if  (@company.github_organizations.count == 1)
		return @company.github_organizations
	end

	def set_default_org id
		@company.default_github_org = @company.github_organizations.find(id)
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
				@github.repos.hooks.create repo.owner, repo.name, name:  "triage", active:  true, 
					config: { "url" => services_github_index_url(subdomain: @company.slug)}, 
					events: ["push", "issues", "issue_comment", "pull_request", "commit_comment"]
			rescue Github::Error::UnprocessableEntity
				Rails.logger.info "hook already exists"
				next
			rescue Github::Error::NotFound
				Rails.logger.info "repo not found"
				next
			end
		end
	end
end