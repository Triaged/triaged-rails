class Github::SetupService
	include Sidekiq::Worker
	include Rails.application.routes.url_helpers

	attr_accessor :property, :github

	def perform property_id
		@property = ProviderProperty.find(property_id)
		@github = Github.new oauth_token: @property.provider_account.provider_credential.access_token
		create_hooks!
	end

	def create_hooks!
		
		@github.repos.hooks.create property.owner, property.name, name: "web", active:  true, 
			config: { "url" => webhook_github_index_url(:company_id => @property.provider_account.company.slug, :protocol => "https")}, 
			events: ["push", "issues", "issue_comment", "pull_request", "commit_comment"]
			
	rescue Github::Error::UnprocessableEntity => e
		Rails.logger.info e
	rescue Github::Error::NotFound
		Rails.logger.info "repo not found"
	end
	
	
end