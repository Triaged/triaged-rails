class Cards::EventSerializer < Cards::BaseSerializer

	attributes :type, :external_id, :timestamp, :title, :body, :footer, :url

 	def type
 		:event
 	end
 
 end
