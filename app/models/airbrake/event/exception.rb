class Airbrake::Event::Exception < Cards::Event
  include Mongoid::Document

  def self.build_from_webhook data, company
		event = Airbrake::Event::Exception.new(
			external_id: data.error.id,
			property_name: data.error.project.name,
			title: "#{data.error.error_message.capitalize} Exception",
			body: data.error.error_message
		)
	end

	def should_push?
		true
	end

end