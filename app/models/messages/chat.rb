class Messages::Chat < Message

  field :body, type: String
  field :user_mentions, type: Array
  

end
