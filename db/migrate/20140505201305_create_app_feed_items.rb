class CreateAppFeedItems < ActiveRecord::Migration
  def change
    create_table :app_feed_items do |t|
      t.references :company_app, index: true
      t.references :feed_item, index: true

      t.timestamps
    end
  end
end
