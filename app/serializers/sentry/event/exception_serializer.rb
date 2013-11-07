class Sentry::Event::ExceptionSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		object.project.capitalize
	end

	def action
		"#{object.level.capitalize} Exception"
	end

	def body
		"#{object.message.truncate(320)}\nat #{object.culprit}"
	end

end