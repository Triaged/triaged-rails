class Messages::Message
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :feed_item
  belongs_to :author, class_name: "User"

	field :uuid, type: String
	field :author_name, type: String
	field :body, type: String
  field :notify, type: Array
  field :timestamp, type: DateTime

  after_create :set_author_name

  def set_author_name
  	author_name = author.name
  end



  # Controller recieves message
  # Message added to feed item
  # Message added to feed
  # Notifications sent

  # If push notification, 
  
end
