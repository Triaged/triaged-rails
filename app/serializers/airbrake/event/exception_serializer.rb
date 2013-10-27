class Airbrake::Event::ExceptionSerializer < TextItemSerializer
  #attributes :project, :message, :error_class, :environment, :times_occurred, :line_number

  def property
  	object.project
  end

  def body
  	object.message
  end
end
