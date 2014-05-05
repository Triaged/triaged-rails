class ConnectedProviderAccount < ActiveRecord::Base
  belongs_to :company
  belongs_to :company_app
  belongs_to :provider_account

  validates :provider_account, :uniqueness => { :scope => :company_app_id }


	def provider_properties
		self.provider_account.provider_properties
	end  
	
end
