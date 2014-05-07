class Notification < ActiveRecord::Base

  belongs_to :user
  belongs_to :feed_item

  validates :user, presence: true
  validates :feed_item, presence: true

end
