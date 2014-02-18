class ConnectedProvider < ActiveRecord::Base

  belongs_to :company
  belongs_to :provider

  validates :provider, uniqueness: true

  after_create :after_create

  def after_create
  	payload = {:company_id => company.id, :provider_name => provider.name}
  	ActiveSupport::Notifications.instrument("provider_credentials.created", payload)
  end
end
