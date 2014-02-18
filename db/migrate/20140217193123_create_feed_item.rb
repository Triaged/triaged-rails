class CreateFeedItem < ActiveRecord::Migration
  def change
    create_table :feed_items do |t|
      t.reference :company
      t.reference :user
      t.boolean :push_notify
      t.datetime :timestamp
    end
  end
end
