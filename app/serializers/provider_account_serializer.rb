class ProviderAccountSerializer < ActiveModel::Serializer
  attributes :id, :external_id, :name, :url, :default, :account_label, :property_label

  has_many :provider_properties
end
