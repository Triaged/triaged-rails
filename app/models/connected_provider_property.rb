class ConnectedProviderProperty < ActiveRecord::Base
	enum status: [ :connected, :disabled ]

  belongs_to :company
  belongs_to :company_app
  belongs_to :provider_property

  validates :provider_property, :uniqueness => { :scope => :company_app_id }

end
