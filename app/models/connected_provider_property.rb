class ConnectedProviderProperty < ActiveRecord::Base
	enum status: [ :connected, :disabled ]

  belongs_to :company
  belongs_to :company_app
  belongs_to :provider_property

  validates :provider_property, :uniqueness => { :scope => :company_app_id }

  after_create :setup_property

  def setup_property
  	Common::RemoteAccountService.setup_property(
  		provider_property.provider_account.provider_credential.user, 
  		provider_property.provider_account.provider, 
  		company, 
  		company_app, 
  		self
  	)
  end

end
