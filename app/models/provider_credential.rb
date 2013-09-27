class ProviderCredential
  include Mongoid::Document

  belongs_to :user
  belongs_to :company
  belongs_to :provider


  field :uid, :type => String
  field :access_token, :type => String
  field :refresh_token, :type => String
  field :shared, :type => Boolean, :default => false

  after_create :provider_created

  def provider_created
  	payload = {:user_id => user.id}
  	ActiveSupport::Notifications.instrument("#{provider.name}.provider_credentials.created", payload)
  end

  def shared_credential
  	user.company.shared_credentials.where(provider_credential_id: self.id)
  end

end
