class Airbrake::Event::Exception < FeedItem
  include Mongoid::Document

  field :project, :type => String
  field :message, :type => String
  field :error_class, :type => String
  field :environment, :type => String
  field :times_occurred, :type => Integer
  field :line_number, :type => Integer

  
	def self.build_from_webhook event
		event = Sentry::Event::Exception.new(
			external_id: event.error.id,
			project: event.error.project.name,
			message: event.error.message,
			error_class: event.error.error_class,
			line_number: event.error.line_number,
			times_occurred: event.times_occurred,
			environment: event.environment
		)
	end

end