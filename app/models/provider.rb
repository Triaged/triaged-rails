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
  	created_method = "#{self.name}_credentials_created"
  	send(created_method, company) if self.respond_to? created_method
  end

  def google_analytics_credentials_created company
  	setup_service = GoogleAnalytics::SetupService.new(company.id)
  	setup_service.fetch_remote_profiles
  end


  def account_settings company
  	created_method = "#{self.name}_account_settings"
  	account_settings = send(created_method, company) if (self.respond_to? created_method)
  	account_settings ? account_settings : {}
	end

  def github_account_settings company
		{
  		:organization => company.default_github_org.name,
  		:repos => company.default_github_org.repos.collect {|repo| repo.name}
  	} if company.default_github_org
	end

  def google_analytics_account_settings company
  	{
  		:account => company.default_google_analytics_account.name,
  		:properties => company.default_google_analytics_account.properties.collect {|property| property.name}
  	} if company.default_google_analytics_account
  end

 
end
