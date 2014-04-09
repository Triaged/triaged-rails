class Event < ActiveRecord::Base

	belongs_to :provider
	has_many :feed_items

end
