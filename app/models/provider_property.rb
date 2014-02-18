class ProviderProperty < ActiveRecord::Base

  belongs_to :provider_account

  validates_uniqueness_of :external_id

end
