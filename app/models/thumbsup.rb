class Thumbsup < ActiveRecord::Base

	belongs_to :user
	belongs_to :feed_item
end