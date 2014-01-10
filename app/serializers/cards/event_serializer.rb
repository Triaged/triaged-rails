class Cards::EventSerializer < FeedItemSerializer
 	attributes :provider_name, :property_name, :external_id, :timestamp

 	attributes :title, :description, :footer
 	attributes :html_url
 	

end
