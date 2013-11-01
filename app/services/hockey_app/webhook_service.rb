class HockeyApp::WebhookService < Service

	@@provider = :hockey_app
	
	def instrument payload
		event_type = payload[:event][:type]

		publish(@@provider, event_type,  {
			:company_id => payload[:company_id],
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end


end