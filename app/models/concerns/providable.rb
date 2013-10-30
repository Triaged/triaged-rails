module Providable
	extend ActiveSupport::Concern

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

  def google_analytics_provider_credentials
  	provider_credentials.where(provider: Provider.named("google_analytics")).first
  end

end