class Services::TrelloController < ServiceController

	def webhook
		# ensure company exists, if not, degrade gracefully
		payload = {event: params, company_id: params[:company_id]}
		Trello::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
