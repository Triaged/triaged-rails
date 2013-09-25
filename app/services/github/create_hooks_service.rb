class Github::CreateHooksService
	include Rails.application.routes.url_helpers

	attr_accessor :user, :github

	def initialize user_id
		@user = User.find(user_id)
		@github = Github.new oauth_token: @user.github_provider_credentials.access_token
	end

	def create!
		initial_setup
		create_hooks
	end
	
	def initial_setup
		# Get all repos
		res = @github.repos.all
		res.each_page { |page| page.each do |repo|
			Github::Repo.create(
				user: @user,
				company: @user.company, 
				external_id: repo.id, 
				html_url: repo.html_url, 
				url: repo.url, 
				name: repo.name,
				full_name: repo.full_name,
				owner: repo.owner.login
			)
		end }
	end

	def create_hooks
		# Rails.logger.info (services_github_index_url(:subdomain => @user.company.slug))
		# @user.company.github_repos.each do |repo|
		# 	begin
		# 		@github.repos.hooks.create repo.owner, repo.name, name:  "web", active:  true, 
		# 			config: { "url" => ENV["GITHUB_WEBHOOK_URL"], 
		# 				"events" => ["push", "issues", "issue_comment", "pull_request", "commit_comment"]}
		# 	rescue Github::Error::UnprocessableEntity
		# 		Rails.logger.info "hook already exists"
		# 		next
		# 	rescue Github::Error::NotFound
		# 		Rails.logger.info "repo not found"
		# 		next
		# 	end
		# end
	end
end