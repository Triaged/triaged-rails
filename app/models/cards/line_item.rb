class Cards::LineItem
	include Mongoid::Document

	field :timestamp, type: String
	field :text, type: String
	field :url, type: String
	field :thumbnail_url, type: String
	field :icon, type: String


	embedded_in :event, class_name: "Cards::Event"

end