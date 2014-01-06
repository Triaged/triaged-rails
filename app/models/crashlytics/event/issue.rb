class Crashlytics::Event::Issue < Cards::Event
  include Mongoid::Document

	def self.build_from_webhook data, company
		event = Crashlytics::Event::Issue.new(
			external_id: data.display_id,
			property_name: data.app.name,
			title: 	"#{data.title.capitalize}",
			body: data["method"].truncate(320),
			footer: "#{data.impacted_devices_count} Impacted Devices"
		)
	end

	def should_push?
		false
	end

end