class Services::GithubController < ServiceController

	def index
		@repos = Company.first.github_repos
	end

	def show
		@repo = Company.first.github_repos.find(params[:id])
	end

	def create
		event_type = request.headers['X-Github-Event']
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: request.subdomain, event_type: event_type}
		Github::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

	# def event_type
	# 	JSON.parse(request.body.string)["action"]
	# end
	
end
