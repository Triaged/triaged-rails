class Cards::Event < Cards::Base
  include Mongoid::Document

  field :title, type: String
  field :body, type: String
  field :footer, type: String
  


  embeds_many :line_items, class_name: "Cards::LineItem"


end
