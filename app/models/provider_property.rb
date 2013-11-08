class ProviderProperty
  include Mongoid::Document

  embedded_in :provider_account

  field :external_id, type: String
  field :name, type: String

  validates_uniqueness_of :external_id

end
