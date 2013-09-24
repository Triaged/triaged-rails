class Sentry::Event::Exception < FeedItem
  include Mongoid::Document

  field :project, :type => String
  field :message, :type => String
  field :culprit, :type => String
  field :logger, :type => String
  field :level, :type => String

  
	def self.build_from_webhook event
		event = Sentry::Event::Exception.new(
			external_id: event.id,
			project: event.project,
			message: event.message,
			culprit: event.culprit,
			logger: event.logger,
			level: event.level
		)
	end

end