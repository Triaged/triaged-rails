class UserFeedItem
  include Mongoid::Document
  embedded_in :user
  belongs_to :feed_item

  field :viewed,	:type => Boolean, :default => false
  index({ feed_item_id: 1 }, { unique: true, background: true })

  validates_uniqueness_of :feed_item

end
