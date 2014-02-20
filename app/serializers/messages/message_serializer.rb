class Messages::MessageSerializer < ApplicationSerializer
  attributes :id, :body, :timestamp, :uuid

  has_one :author
end
