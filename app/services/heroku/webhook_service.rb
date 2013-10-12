class Heroku::WebhookService < Service 

	@@provider = :heroku
	@@event_type = :deploy
	
	def instrument payload
		publish(@@provider, @@event_type,  {
			:company_id => payload[:company_id],
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

end