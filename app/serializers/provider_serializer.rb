class ProviderSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_one :account

  def account
  	current_user.company.provider_accounts.where(provider: object, default: true).first
  end
end
