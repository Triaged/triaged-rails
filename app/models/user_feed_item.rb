class UserFeedItem < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :feed_item
 
  validates_uniqueness_of :feed_item_id
end
