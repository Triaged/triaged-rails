class UserFeedItem < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :feed_item
 
  validates :feed_item_id, :uniqueness => {:scope => :user_id}
end
