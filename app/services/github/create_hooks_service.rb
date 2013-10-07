class Github::CreateHooksService
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def initialize company_id
		@company = Company.find(company_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
	end

	def create!
		set_default_org unless @company.github_org
		save_repos
		create_repo_hooks
	end

	def set_default_org
		orgs = @github.orgs.all.to_a
		org = orgs[0] # @TODO: make configurable

		new_org = Github::Org.create(
			external_id: org.id,
			name: org.login,
			url: org.url,
			company: @company
		)

		return new_org
	end
	
	def save_repos
		# Get all repos for the org
		org = @company.github_org
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
		@company.github_org.repos.each do |repo|
			begin
				@github.repos.hooks.create repo.owner, repo.name, name:  "web", active:  true, 
					config: { "url" => services_github_index_url(subdomain: @company.slug)}, 
					events: => ["push", "issues", "issue_comment", "pull_request", "commit_comment"]
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