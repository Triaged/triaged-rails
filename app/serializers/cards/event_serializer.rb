class Cards::EventSerializer < FeedItemSerializer
 	attributes :provider_name, :property_name, :external_id

 	attributes :title, :description, :footer
 	attributes :html_url
 	

end
