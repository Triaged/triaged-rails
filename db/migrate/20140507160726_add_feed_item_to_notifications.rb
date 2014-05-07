class AddFeedItemToNotifications < ActiveRecord::Migration
  def change
    add_reference :notifications, :feed_item, index: true
  end
end
