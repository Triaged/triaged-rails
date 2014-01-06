class NewRelic::Event::ErrorThreshold < Cards::Event
  include Mongoid::Document

  
	def self.build_from_webhook data
		# event = NewRelic::Event::ErrorThreshold.new(
		# 	external_id: data.external_id,
		# 	timestamp: data.created_at,
		# 	application_name: data.application_name,
		# 	account_name: data.application_name,
		# 	severity: data.severity,
		# 	message: data.message,
		# 	short_description: data.short_description,
		# 	long_description: data.long_description,
		# 	html_url: data.alert_url
		# )

		event = NewRelic::Event::ErrorThreshold.new(
			external_id: data.external_id,
			property_name: data.application_name,
			title: "Error Threshold",
			body: data.long_description
		)
	end

	def should_push?
		true
	end

	

end