class ProviderAccount < ActiveRecord::Base

  belongs_to :provider
  belongs_to :company
  belongs_to :company_app
  belongs_to :provider_credential
  has_many :provider_properties

  delegate :account_label, :to => :provider
  delegate :property_label, :to => :provider

	validates :provider, :uniqueness => { :scope => :company_app }

  def set_user_follows user
		provider_properties.each {|property| property.follows = !user.ignores?(property) }
	end

	def self.provided_by provider
  	ProviderAccount.where(provider: provider)
  end

end
