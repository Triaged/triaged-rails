class Services::BeanstalkController < ServiceController

	def create
		event_type = "push"
		payload = {event: params, company_id: request.subdomain, event_type: event_type}
		Beanstalk::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end