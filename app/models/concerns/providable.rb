module Providable
	extend ActiveSupport::Concern

	included do
		has_many :provider_credentials
	end

	# following
	def can_follow_provider? provider
		#credentials = credentials_for_provider provider
		#credentials ? true : false
		true # Can always follow a provider, for now... later, we might enfore individual oAuth
	end

	def credentials_for_provider provider
		# First check this user directly
		credentials = ProviderCredential.where(user: self, provider: provider).first
		# Then check for shared credentials within the company
		credentials = company.shared_credentials.where(provider: provider).first unless credentials
	end

	# provider scopes
	def stripe_provider_credentials
  	provider_credentials.where(provider: Provider.stripe).first
  end

  def github_provider_credentials
  	provider_credentials.where(provider: Provider.github).first
  end

end