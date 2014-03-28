class AddMessagesCountToFeedItems < ActiveRecord::Migration
  def change
  	add_column :feed_items, :messages_count, :integer, default: 0
  end
end
