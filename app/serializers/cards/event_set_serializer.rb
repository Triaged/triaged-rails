class Cards::EventSetSerializer < Cards::BaseSerializer
  attributes :type, :title 

  has_many :events

  def type
 		:event_set
 	end
end
