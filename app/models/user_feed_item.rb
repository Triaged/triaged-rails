class UserFeedItem
  include Mongoid::Document
  embedded_in :user
  belongs_to :feed_item

  field :_id, type: String, default: ->{ feed_item_id }
  validates_uniqueness_of :feed_item

end
