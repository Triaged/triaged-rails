class NewRelic::Event::DowntimeEnded < Cards::Event
  include Mongoid::Document

 	def self.build_from_webhook data
		# event = NewRelic::Event::DowntimeEnded.new(
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

		event = NewRelic::Event::DowntimeEnded.new(
			external_id: data.external_id,
			property_name: data.application_name,
			title: "Downtime Ended",
			body: data.long_description
		)
	end

end