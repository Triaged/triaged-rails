class ProviderSerializer < ActiveModel::Serializer
  attributes :id, :name, :webhook_url, :connected
  has_one :account, serializer: ProviderAccountSerializer

  def account
  	current_user.company.provider_accounts.where(provider: object, default: true).first
  end

  def webhook_url
  	object.webhook_url_for_company(current_user.company) if object.webhooks_enabled
  end

  def connected
  	current_user.company.provider_connected? object
  end

  
end
