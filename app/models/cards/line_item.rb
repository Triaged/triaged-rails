class Cards::LineItem
	include Mongoid::Document

	field :text, type: String
	field :url, type: String
	field :thumbnail_url, type: String

	embedded_in :event, class_name: "Cards::Event"

end