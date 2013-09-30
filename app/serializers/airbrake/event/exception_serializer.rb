class Airbrake::Event::ExceptionSerializer < EventSerializer
  attributes :project, :message, :error_class, :environment, :times_occurred, :line_number
end
