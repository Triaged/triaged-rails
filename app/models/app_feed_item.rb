class AppFeedItem < ActiveRecord::Base
  belongs_to :company_app
  belongs_to :feed_item

  validates :feed_item_id, :uniqueness => {:scope => :company_app_id}
end
