class AccountSerializer < ApplicationSerializer
  attributes :id, :push_enabled, :company_name, :validated_belongs_to_company, :authentication_token, :company_validation_token, :api_token
  attribute :personal_account
	has_many :teammates
  
  has_one :current_user, serializer: UserSerializer
  has_many :providers, serializer: ProviderSettingSerializer

  def current_user
    object
  end

  def company_name
  	object.company.name
  end

  def api_token
  	object.company.api_token
  end

  def avatar_url
  	object.avatar.face.url
  end

  def personal_account
  	object.personal
  end

  def providers
  	Provider.active
  end

end
