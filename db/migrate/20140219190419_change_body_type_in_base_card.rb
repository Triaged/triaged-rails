class ChangeBodyTypeInBaseCard < ActiveRecord::Migration
  def change
  	change_column :feed_items, :title, :text
  	change_column :feed_items, :body, :text
  	change_column :feed_items, :footer, :text
  end
end
