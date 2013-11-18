class NewRelic::Event::DowntimeSerializer < TextItemSerializer
	#attributes :application_name, :account_name, :severity, :message, :short_description, :long_description

	def property
		object.application_name.capitalize
	end

	def action
		"Downtime"
	end

	def body
		object.long_description
	end
end
