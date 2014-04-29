class EventType < ActiveRecord::Base

	belongs_to :provider
	has_many :feed_items

	validates :name, :uniqueness => {:scope => :provider_id}

end
