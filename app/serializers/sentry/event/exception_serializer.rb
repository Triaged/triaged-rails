class Sentry::Event::ExceptionSerializer < EventSerializer
	attributes :project, :message, :culprit, :logger, :level

end