class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url
  attributes :push_enabled, :company_name, :validated_belongs_to_company, :authentication_token
  attribute :personal_account
	has_one :provider_settings, serializer: ProviderSettingsSerializer
  has_many :teammates

  def company_name
  	Rails.logger.info object
  	object.company.name
  end

  def avatar_url
  	object.avatar.face.url
  end

  def personal_account
  	object.company.personal
  end

end
