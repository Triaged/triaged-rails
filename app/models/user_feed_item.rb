class UserFeedItem
  include Mongoid::Document
  embedded_in :user
  belongs_to :feed_item

  validates_uniqueness_of :feed_item
end
