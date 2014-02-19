class CreateFeedItem < ActiveRecord::Migration
  def change
    create_table :feed_items, :as_relation_superclass => true do |t|
      t.references :company
      t.references :user
      t.boolean :push_notify
      t.datetime :timestamp
    end
  end
end
