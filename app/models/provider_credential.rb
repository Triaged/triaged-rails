class ProviderCredential
  include Mongoid::Document

	belongs_to :company
  belongs_to :provider

  # Oauth Providers require credentials
  field :uid, :type => String
  field :access_token, :type => String
  field :refresh_token, :type => String

  validates :company, uniqueness: true, scope: :provider
  

  #after_create :provider_created

  def provider_created
  	payload = {:company_id => company.id}
  	ActiveSupport::Notifications.instrument("provider_credentials.created.#{provider.name}", payload)
  end

end
