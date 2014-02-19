class BaseCard < ActiveRecord::Base
	acts_as :feed_item

	belongs_to :provider
	belongs_to :provider_account

	validates :provider, presence: true
	validates :title, presence: true
	validates :external_id, presence: true

	mount_uploader :event_image, ItemImageUploader
end
