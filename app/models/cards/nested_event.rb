class Cards::NestedEvent
	
	field :external_id, type: String
	field :property_name, :type => String

	field :description, type: String
	field :footer, type: String
	field :timestamp, type: String
	
	field :url, type: String
	
	field :thumbnail_url, type: String
	field :icon, type: String
	field :mime_type, type: String


	embedded_in :event_set, class_name: "Cards::EventSet"
	validates_uniqueness_of :external_id

end