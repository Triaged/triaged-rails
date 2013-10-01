class Messages::MessageSerializer < ActiveModel::Serializer
  attributes :id, :author_name, :body

  def author_name
  	object.author.name
  end
end
