class Cards::EventSet < Cards::Base
	include Mongoid::Document

  field :title, type: String
  field :embedded_external_ids, type: Array
  
	embeds_many :events, class_name: "Cards::NestedEvent"


	def collapse_to_event
		Cards::Event.new(
			company_id: self.company_id,
			provider_name: self.provider_name, 
			event_name: self.event_name,
			title: self.title,
			push_notify: self.should_push,
			external_id: self.events.first.external_id,
			property_name: self.events.first.property_name,
			body: self.events.first.description,
			footer: self.events.first.footer,
			timestamp: self.events.first.timestamp,
			url: self.events.first.url
		)
	end

end