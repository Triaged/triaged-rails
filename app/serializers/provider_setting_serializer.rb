class ProviderSettingSerializer < ProviderSerializer

	attributes :follows, :webhook_url, :connected, :oauth_path
	has_one :provider_account, serializer: ProviderAccountSerializer

	def provider_account
  	current_user.company.provider_accounts.where(provider: object, default: true).first
  end

  def webhook_url
  	object.webhook_url_for_company_and_app(current_user.company) if object.webhooks_enabled
  end

  def connected
  	current_user.company.provider_connected? object
  end

  def follows
  	!current_user.ignores? object
  end

  
end