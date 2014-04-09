class Provider < ActiveRecord::Base
	include Rails.application.routes.url_helpers
 
  mount_uploader :large_icon, LargeProviderIconUploader
  mount_uploader :small_icon, SmallProviderIconUploader

  has_many :feed_items
  has_many :event_types
  has_one :provider_account

  validates :name, uniqueness: true

  scope :active, -> { where(active: true) }
  
  def self.named name
  	Provider.where(name: name).first
  end

  def icon
    "#{name}.png"
  end

  def settings_icon
    "#{name}-s.png"
  end

  def webhook_url_for_company company
  	webhook_url = "webhook_#{name}_index_url"
  	send(webhook_url, :company_id => company.slug, :protocol => "https")
  end

  def delete_provider_account provider_account
    # @TODO clean up any rements of deleting account, for example remove Github hooks
  end
end
