class Messages::ChatSerializer < ApplicationSerializer
  attributes :id, :body, :timestamp, :uuid, :author_name, :created_at
  has_one :author

end
