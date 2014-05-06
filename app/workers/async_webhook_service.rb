class AsyncWebhookService
	include Sidekiq::Worker

	def perform event_class_string, payload
		Rails.logger.info "Building event for #{event_class_string}"
		
		event_class = event_class_string.constantize

		payload = RecursiveOpenStruct.new(payload)

		api_token = ApiToken.find(payload.company_id)
		company = api_token.company
		app = api_token.app
		
		json_event = event_class.build_from_webhook payload.event,company

		Common::FeedService.build_event_card(json_event, company) 
	end



end