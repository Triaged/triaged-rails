class Airbrake::Event::Exception < FeedItem
  include Mongoid::Document

  field :project, :type => String
  field :message, :type => String
  field :error_class, :type => String
  field :environment, :type => String
  field :times_occurred, :type => Integer
  field :line_number, :type => Integer

  
	def self.build_from_webhook data
		event = Airbrake::Event::Exception.new(
			external_id: data.error.id,
			project: data.error.project.name,
			message: data.error.error_message,
			error_class: data.error.error_class,
			line_number: data.error.line_number,
			times_occurred: data.error.times_occurred,
			environment: data.error.environment
		)
	end



end