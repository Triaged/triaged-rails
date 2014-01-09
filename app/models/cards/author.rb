class Cards::Author 
	include Mongoid::Document

	field :email, type: String
	field :name, type: String
	field :username, type: String

	embedded_in :event, class_name: "Cards::Event"
	embedded_in :nested_event, class_name: "Cards::NestedEvent"