class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url

  attribute :provider_settings, key: :providers

  def avatar_url
  	object.avatar_url
  end
end
