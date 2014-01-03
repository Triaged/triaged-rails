class Messages::Chat < Message
  include Mongoid::Document
  

  field :body, type: String
  field :user_mentions, type: Array
  

end
