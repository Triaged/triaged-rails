class Provider
	include Rails.application.routes.url_helpers
  include Mongoid::Document
  

  field :name, :type => String
  field :webhooks_enabled, :type => Boolean

  validates :name, uniqueness: true
  
  def self.named name
  	Provider.where(name: name).first
  end

  def webhook_url_for_company company
  	webhook_url = "webhook_#{name}"
  	send(webhook_url, :id => company.slug)
  end
 
end
