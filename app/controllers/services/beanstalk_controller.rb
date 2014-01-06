class Services::BeanstalkController < ServiceController

	def webhook
		event_type = "push"
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: params[:company_id], event_type: event_type}
		Beanstalk::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end