class BaseCardSerializer < FeedItemSerializer
  has_one :provider
 	attributes :event_name

end
