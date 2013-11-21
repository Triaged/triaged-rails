class Github::CreateHooks
	include Sidekiq::Worker
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def perform company_id
		@company = Company.find(company_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
		create_hooks!
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
	rescue Github::Error::NotFound # Ned to fix this soon, handles personal accounts
		org = @company.default_github_org
		res = @github.repos.list
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
					config: { "url" => webhook_github_index_url(:company_id => @company.slug, :protocol => "https")}, 
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