class Services::GithubController < ServiceController
	before_action :authenticate_user!, :except => :webhook
	before_action :set_company, :except => :webhook
	

	def org_list
		@organizations = Github::SetupService.new(@company.id).fetch_remote_organizations

		#@organizations = @company.provider_accounts.provided_by(Provider.named "github")
		redirect_to(oauth_failure_path(error: "No Github Organization Found")) if (@organizations.count == 0)
		redirect_to(oauth_complete_path) if (@organizations.count == 1)
	end

	def set_default_org
		org = @company.provider_accounts.find(params[:id])
		org.set_default_account!
		Github::SetupService.new(@company.id).create_hooks!

		redirect_to(oauth_complete_path)
	end

	def webhook
		company = Company.find(params[:id])
		event_type = request.headers['X-Github-Event']
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: company.id, event_type: event_type}
		Github::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

private
	
	def set_company
		@company = current_user.company
	end

end
