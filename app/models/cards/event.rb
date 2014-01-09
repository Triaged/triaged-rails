class Cards::Event < Cards::Base
	include Mongoid::Document
 
	field :external_id, type: String
	field :property_name, :type => String

	field :title, type: String
	field :description, type: String
	field :footer, type: String
	
	
	field :url, type: String
	
	field :thumbnail_url, type: String
	field :icon, type: String
	field :mime_type, type: String

	embeds_one :author, class_name: "Cards::Author"


end
