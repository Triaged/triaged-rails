class NewRelic::WebhookService < Service
	
	def instrument payload
		event_type = event_type(payload)
		publish({:company_id => payload[:company_id], :event => event_data(payload) })
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def publish(payload)
		Rails.logger.info "new_relic.exception"
		ActiveSupport::Notifications.instrument("sentry.exception", payload)
		Rails.logger.info "Published"
 	end

 	def event_type payload
 		return "deployment" if payload.key? "deployment"
 		return "app_alert" if payload.key? "app_alert" # @TODO: Find key
 		return alert_type(payload["alert"]) if payload.key? "alert"
 	end

 	def alert_type alert
 		return "downtime" if (alert["severity"] == "downtime" && alert["short_descripton"].include? "opened")
		return "downtime_ended" if (alert["severity"] == "downtime" && alert["short_descripton"].include? "ended")
		return "error_threshold" if (alert["message"].include? "Error rate" && alert["short_descripton"].include? "opened")
		return "error_threshold_ended" if (alert["message"].include? "Error rate" && alert["short_descripton"].include? "ended")
		return "apdex_alert" if (alert["message"].include? "Apdex score" && alert["short_descripton"].include? "opened")
		return "apdex_alert_ended" if (alert["message"].include? "Apdex score" && alert["short_descripton"].include? "ended")
 	end

 	def event_data payload
 		# remove the root element
 		root = payload[:event].keys.first
 		data = payload[root]
 		# merge the external id
 		data.merge(external_id: payload[:external_id])
 		return data
 	end

end