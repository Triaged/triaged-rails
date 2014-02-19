class CreateUserFeedItems < ActiveRecord::Migration
  def change
    create_table :user_feed_items do |t|
      t.references :user
      t.references :feed_item
    end
  end
end
