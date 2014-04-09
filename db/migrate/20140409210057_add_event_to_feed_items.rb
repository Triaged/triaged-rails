class AddEventToFeedItems < ActiveRecord::Migration
  def change
    add_reference :feed_items, :event, index: true
  end
end
