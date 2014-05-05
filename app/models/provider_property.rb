class ProviderProperty < ActiveRecord::Base

  belongs_to :provider_account
  has_many :connected_provider_properties

  validates_uniqueness_of :external_id

  def connected_to_app? company_app
  	0 < ConnectedProviderProperty.where(provider_property: self, company_app: company_app) \
  															 .where("status <> ?", ConnectedProviderProperty.statuses[:connected]).count
  end

end
