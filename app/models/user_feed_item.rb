class UserFeedItem
  include Mongoid::Document
  include Mongoid::Timestamps
  
  embedded_in :user
  belongs_to :feed_item
 
  validates_uniqueness_of :feed_item_id
end
