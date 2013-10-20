class Services::BeanstalkController < ServiceController

	def webhook
		company = Company.find(params[:id])
		event_type = "push"
		payload = {event: params, company_id: company.id, event_type: event_type}
		Beanstalk::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end