class NewRelic::WebhookService < Service

	@@provider = :new_relic
	
	def instrument payload
		publish(@@provider, event_type(payload), {
			:company_id => payload[:company_id],
			:event => event_data(payload) 
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	
 	def event_type payload
 		return "deployment" if payload[:event].key? "deployment"
 		return "app_alert" if payload[:event].key? "app_alert" # @TODO: Find key
 		return alert_type(payload[:event]["alert"]) if payload[:event].key? "alert"
 	end

 	def alert_type alert
 		alert = JSON.parse(alert)
 		return "downtime" if (alert["severity"] == "downtime" && alert["short_description"].include?("opened"))
		return "downtime_ended" if (alert["severity"] == "downtime" && alert["short_description"].include?("ended"))
		return "error_threshold" if (alert["message"].include?("Error rate") && alert["short_description"].include?("opened"))
		return "error_threshold_ended" if (alert["message"].include?("Error rate") && alert["short_description"].include?("ended"))
		return "apdex_alert" if (alert["message"].include?("Apdex score") && alert["short_description"].include?("opened"))
		return "apdex_alert_ended" if (alert["message"].include?("Apdex score") && alert["short_description"].include?("ended"))
 	end

 	def event_data payload
 		# remove the root element
 		root = payload[:event].keys.first
 		data = JSON.parse(payload[:event][root])
 		# merge the external id
 		data.merge!(external_id: payload[:external_id])
 		return data
 	end

end