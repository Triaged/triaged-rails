class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url
  attributes :push_enabled, :company_name, :validated_belongs_to_company, :authentication_token, :company_validation_token
  attribute :personal_account
	has_many :teammates
  has_many :providers

  def company_name
  	object.company.name
  end

  def avatar_url
  	object.avatar.face.url
  end

  def personal_account
  	object.company.personal
  end

  def providers
  	Provider.all
  end

end
