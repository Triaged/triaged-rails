class CreateFeedItem < ActiveRecord::Migration
  def change
    create_table :feed_items, :as_relation_superclass => true do |t|
      t.references :company
      t.references :user
      t.boolean :push_notify
      t.datetime :timestamp
      t.references :provider
      t.references :provider_account
      t.string :provider_name
      t.string :event_name
      t.string :account_name
      t.string :property_name
      t.string :external_id
      t.string :title
      t.string :body
      t.string :body_list, array: true, default: []
      t.string :footer
      t.string :url
      t.string :thumbnail_url
      t.string :image_url
      t.string :icon
      t.string :mime_type
      t.boolean :group_event, default: false
    end
  end
end
