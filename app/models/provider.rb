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
  	webhook_url = "webhook_#{name}_url"
  	send(webhook_url, :id => company.slug, :protocol => "https")
  end
end
