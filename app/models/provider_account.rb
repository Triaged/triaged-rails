class ProviderAccount
  include Mongoid::Document

  belongs_to :provider
  belongs_to :company
  embeds_many :provider_properties

  field :external_id, type: String
  field :name, type: String
  field :url, type: String
  field :default, type: Boolean, default: false

  validates_uniqueness_of :external_id

  def set_default_account!
		self.update_attribute(:default, true)
	end


  def self.provided_by provider
  	ProviderAccount.where(provider: provider)
  end

end
