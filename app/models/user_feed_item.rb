class UserFeedItem < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :feed_item
 
  validates_uniqueness_of [:user_id, :feed_item_id]
end
