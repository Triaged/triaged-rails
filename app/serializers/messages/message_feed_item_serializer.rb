class Messages::MessageFeedItemSerializer < EventSerializer
  attributes :author, :body, :feed_item_id
end
