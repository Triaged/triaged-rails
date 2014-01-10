class Cards::EventSetSerializer < ActiveModel::Serializer
  attributes :id, :title

  has_many :events
end
