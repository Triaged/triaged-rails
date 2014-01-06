class Github::SetupService
	include Sidekiq::Worker
	include Rails.application.routes.url_helpers

	attr_accessor :company, :github

	def perform account_id
		@account = ProviderAccount.find(account_id)
		@github = Github.new oauth_token: @company.github_provider_credentials.access_token
		create_hooks!
	end

	def create_hooks!
		@account.provider_properties.each do |repo|
			begin
				Rails.logger.info repo.name
				@github.repos.hooks.create repo.owner, repo.name, name: "web", active:  true, 
					config: { "url" => webhook_github_index_url(:company_id => @account.company.slug, :protocol => "https")}, 
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