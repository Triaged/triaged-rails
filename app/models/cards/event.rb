class Cards::Event < Cards::Base
  include Mongoid::Document

  
  field :provider_name, type: String
  field :event_name, type: String
  
  field :body, type: String
  field :title, type: String


  embeds_many :line_items, class_name: "Cards::LineItem"


end
