class Cards::EventSetSerializer < ActiveModel::Serializer
  attributes :id, :title

  has_many :events

  	def type
 		:event_set
 	end
end
