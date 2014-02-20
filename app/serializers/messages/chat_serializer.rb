class Messages::ChatSerializer < ApplicationSerializer
  attributes :id, :body, :timestamp, :uuid, :author_name, :created_at

  has_one :author

  def author_name
  	object.author.name
  end
end
