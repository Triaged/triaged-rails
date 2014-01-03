class Provider
	include Rails.application.routes.url_helpers
  include Mongoid::Document
  

  field :name, :type => String
  field :account_label, :type => String
  field :property_label, :type => String
  field :webhooks_enabled, :type => Boolean

  validates :name, uniqueness: true
  
  def self.named name
  	Provider.where(name: name).first
  end

  def webhook_url_for_company company
  	webhook_url = "webhook_#{name}_index_url"
  	send(webhook_url, :company_id => company.slug, :protocol => "https")
  end

  def delete_provider_account provider_account
    # @TODO clean up any rements of deleting account, for example remove Github hooks
  end
end
