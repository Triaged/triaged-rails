class Sentry::Event::Exception < FeedItem
  include Mongoid::Document

  field :project, :type => String
  field :message, :type => String
  field :culprit, :type => String
  field :logger, :type => String
  field :level, :type => String

  
	def self.build_from_webhook data
		event = Sentry::Event::Exception.new(
			external_id: data.id,
			project: data.project,
			message: data.message,
			culprit: data.culprit,
			logger: data.logger,
			level: data.level,
			html_url: data.url
		)
	end

	def should_push?
		true
	end

	def push_message
		message
	end

end