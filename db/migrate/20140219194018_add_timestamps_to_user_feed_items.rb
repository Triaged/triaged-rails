class AddTimestampsToUserFeedItems < ActiveRecord::Migration
  def change
  	change_table(:user_feed_items) { |t| t.timestamps }
  end
end
