class Cards::EventSet < Cards::Base
	include Mongoid::Document

  field :title, type: String
  field :embedded_external_ids, type: Array
  
	embeds_many :events, class_name: "Cards::NestedEvent"

end