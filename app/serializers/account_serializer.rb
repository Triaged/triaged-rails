class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url
  attributes :push_enabled, :company_name, :validated_belongs_to_company
  attribute :personal_account
	attribute :provider_settings, key: :providers
  has_many :teammates

  def company_name
  	object.company.name
  end

  def avatar_url
  	object.avatar.face.url
  end

  def personal_account
  	object.company.personal
  end

end
