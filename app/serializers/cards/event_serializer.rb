class Cards::EventSerializer < FeedItemSerializer
 	attributes :title, :body, :provider_name, :footer, :html_url

 	has_many :line_items

end
