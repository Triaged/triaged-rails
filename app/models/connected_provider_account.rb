class ConnectedProviderAccount < ActiveRecord::Base
  enum status: [ :connected, :disabled, :waiting ]

  belongs_to :provider
  belongs_to :company
  belongs_to :company_app
  belongs_to :provider_credential
  has_many :connected_provider_properties
  has_many :provider_properties, :through => :connected_provider_properties

  has_many :connected_account_provider_properties
  has_many :available_provider_properties, :through => :connected_account_provider_properties, :source => :provider_property

  accepts_nested_attributes_for :connected_provider_properties

  delegate :account_label, :to => :provider
  delegate :property_label, :to => :provider

	validates :provider, :uniqueness => { :scope => :company_app }

  def set_user_follows user
		provider_properties.each {|property| property.follows = !user.ignores?(property) }
	end

  def available_properties
    if self.default
      logger.info "all properties"
      self.provider_properties
    else
      logger.info "available properties"
      self.available_provider_properties
    end
  end

	def self.provided_by provider
  	ConnectedProviderAccount.where(provider: provider)
  end

  def self.create_default! company, app, provider, credentials=nil
    ConnectedProviderAccount.create(
      company: company, 
      company_app: app, 
      provider: provider,
      provider_credential: credentials,
      external_id: nil,
      name: "default",
      default: true
    )
  end

end
