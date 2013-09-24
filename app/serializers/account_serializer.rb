class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email

  has_many :followed_providers, key: :providers
end
