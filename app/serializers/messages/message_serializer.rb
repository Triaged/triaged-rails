class Messages::MessageSerializer < ActiveModel::Serializer
  attributes :id, :author, :body
end
