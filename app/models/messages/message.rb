class Messages::Message
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :feed_item

	field :author, type: String
  field :body, type: String
  field :notify, type: Array



  # Controller recieves message
  # Message added to feed item
  # Message added to feed
  # Notifications sent

  # If push notification, 
  
end
