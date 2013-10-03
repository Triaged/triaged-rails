class Sentry::Event::ExceptionSerializer < FeedItemSerializer
	attributes :project, :message, :culprit, :logger, :level

end