class ProviderProperty < ActiveRecord::Base
	

  belongs_to :provider_account
  delegate :provider, :to => :provider_account

  validates :external_id, :uniqueness => { :scope => :provider_account }

  # after_create :setup_property

  # def setup_property
  # 	Common::RemoteAccountService.setup_property(
  # 		provider_property.provider_account.provider_credential.user, 
  # 		provider_property.provider_account.provider, 
  # 		company, 
  # 		company_app, 
  # 		self
  # 	)
  # end

end
