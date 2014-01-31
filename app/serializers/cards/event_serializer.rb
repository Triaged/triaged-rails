class Cards::EventSerializer < Cards::BaseSerializer

	attributes :type, :external_id, :timestamp, :title, :body, :footer, :url, :property_name, :image_url, :thumbnail_url

 	def type
 		:event
 	end

 	def body
 		object.body || object.body_list.collect {|entry| "- #{entry}" }.join("\n")
 	end

 	def image_url
 		object.event_image.ios.url
 	end
 
 end
