class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email

  attribute :provider_settings, key: :providers
end
