class CreateUserFeedItems < ActiveRecord::Migration
  def change
    create_table :user_feed_items do |t|
      t.reference :user
      t.reference :feed_item
    end
  end
end
