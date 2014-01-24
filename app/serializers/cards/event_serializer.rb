class Cards::EventSerializer < Cards::BaseSerializer

	attributes :type, :external_id, :timestamp, :title, :description, :footer, :url

 	def type
 		:event
 	end
 
 end
