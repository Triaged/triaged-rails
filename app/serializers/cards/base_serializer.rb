class Cards::BaseSerializer < FeedItemSerializer
  
	has_one :provider
 	has_one :provider_account

 	attributes :event_name

end
