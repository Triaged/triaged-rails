class Crashlytics::Event::IssueSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Crashlytics"
	end

	def action
		"#{object.title.capitalize}"
	end

	def body
		"#{object.method.truncate(320)}\n\n#{object.impacted_devices_count} Impacted Devices"
	end
end