class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url
  attributes :company_name
	attribute :provider_settings, key: :providers
  has_many :teammates

  def company_name
  	object.company.name
  end

  def avatar_url
  	object.avatar.face.url
  end

end
