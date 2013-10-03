class Airbrake::Event::ExceptionSerializer < FeedItemSerializer
  attributes :project, :message, :error_class, :environment, :times_occurred, :line_number
end
