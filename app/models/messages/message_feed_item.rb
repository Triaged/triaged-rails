class Messages::MessageFeedItem < FeedItem
  include Mongoid::Document

  field :author, type: String
  field :body, type: String
  field :feed_item_id, type: String
  field :provider_name, type: String
  field :event_name, type: String

  def self.build_from_message message

		message_feed_item = Messages::MessageFeedItem.new(
			author: message.author,
			body: message.body,
			external_id: message.id,
			timestamp: message.created_at,
			feed_item_id: message.feed_item.id,
			provider_name: message.feed_item.provider_name,
			event_name: message.feed_item.event_name
			)
		message_feed_item
	end
end
