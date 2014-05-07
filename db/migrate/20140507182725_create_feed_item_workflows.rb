class CreateFeedItemWorkflows < ActiveRecord::Migration
  def change
    create_table :feed_item_workflows do |t|
      t.references :feed_item, index: true
      t.references :provider_workflow, index: true

      t.timestamps
    end
  end
end
