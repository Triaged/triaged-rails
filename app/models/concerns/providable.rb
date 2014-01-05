module Providable
	extend ActiveSupport::Concern

	included do 
		has_many :provider_credentials
	end

	def credentials_for_provider provider
		# First check this user directly
		# credentials = ProviderCredential.where(user: self, provider: provider).first
		# Then check for shared credentials within the company
		credentials = self.provider_credentials.where(provider: provider).first
	end

	# provider scopes
	def stripe_provider_credentials
  	provider_credentials.where(provider: Provider.named("stripe")).first
  end

  def github_provider_credentials
  	provider_credentials.where(provider: Provider.named("github")).first
  end

  def bitbucket_provider_credentials
  	provider_credentials.where(provider: Provider.named("bitbucket")).first
  end

  def google_analytics_provider_credentials
  	provider_credentials.where(provider: Provider.named("google_analytics")).first
  end

  def appfigures_provider_credentials
  	provider_credentials.where(provider: Provider.named("appfigures")).first
  end

  def dropbox_provider_credentials
    provider_credentials.where(provider: Provider.named("dropbox")).first
  end

end