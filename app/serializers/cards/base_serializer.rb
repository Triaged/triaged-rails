class Cards::BaseSerializer < FeedItemSerializer
  
	has_one :provider
 	
 	attributes :event_name

end
