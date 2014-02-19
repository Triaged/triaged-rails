class AddTimestampsToFeedItem < ActiveRecord::Migration
  def change
  	change_table(:feed_items) { |t| t.timestamps }
  end
end
