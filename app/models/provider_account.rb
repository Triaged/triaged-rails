class ProviderAccount < ActiveRecord::Base

  belongs_to :provider
  belongs_to :company
  has_many :provider_properties

  delegate :account_label, :to => :provider
  delegate :property_label, :to => :provider

	validates :external_id, :uniqueness => { :scope => [:company, :provider] }

  def set_default_account!
		self.update_attribute(:default, true)
	end

	def set_user_follows user
		provider_properties.each {|property| property.follows = !user.ignores?(property) }
	end

	def self.provided_by provider
  	ProviderAccount.where(provider: provider)
  end



end
