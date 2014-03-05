class RenameFeedItemUser < ActiveRecord::Migration
  def change
  	rename_column :feed_items, :user_id, :author_id
  end
end
