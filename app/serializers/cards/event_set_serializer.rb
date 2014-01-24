class Cards::EventSetSerializer < ActiveModel::Serializer
  attributes :type, :id, :title 

  has_many :events

  def type
 		:event_set
 	end
end
