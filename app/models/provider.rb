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
  	webhook_url = "webhook_#{name}_url"
  	send(webhook_url, :id => company.slug, :protocol => "https")
  end

  def credentials_created company
  	send("#{self.name}_credentials_created", company)
  end

  def google_analytics_credentials_created company
  	setup_service = GoogleAnalytics::SetupService.new(company.id)
  	setup_service.fetch_remote_profiles
  end
 
end
