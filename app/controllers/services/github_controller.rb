class Services::GithubController < ServiceController
	before_action :set_company
	before_action :authenticate_user!, :except => :create
	

	def index
		@repos = Company.first.github_repos
	end

	def show
		@repo = Company.first.github_repos.find(params[:id])
	end

	def org_list
		@organizations = Github::Service.new(@company.id).fetch_remote_organizations

		redirect_to(oauth_failure_path(error: "No Github Organization Found")) if (@organizations.count == 0)
		redirect_to(oauth_complete_path) if (@organizations.count == 1)
	end

	def set_default_org
		@company.default_github_org = @company.github_organizations.find(params[:id])
		@company.save
	end

	def create
		event_type = request.headers['X-Github-Event']
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: @company.id, event_type: event_type}
		Github::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

private
	
	def set_company
		@company = Company.find(request.subdomain)
	end

end
