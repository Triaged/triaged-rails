class Messages::MessageSerializer < ActiveModel::Serializer
  attributes :id, :body, :timestamp, :uuid

  has_one :author
end
