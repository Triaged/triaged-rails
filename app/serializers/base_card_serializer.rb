class BaseCardSerializer < FeedItemSerializer
  has_one :provider
 	attributes :event_name

 	def event_name
 		object.event_type.name
 	end

end
