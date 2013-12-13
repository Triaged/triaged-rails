class Services::BeanstalkController < ServiceController

	def webhook
		event_type = "push"
		payload = {event: params["payload"], company_id: params[:company_id], event_type: event_type}
		Beanstalk::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end