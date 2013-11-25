class ProviderCredential
  include Mongoid::Document

	belongs_to :user
  belongs_to :provider
  belongs_to :company

  # Oauth Providers require credentials
  field :uid, :type => String
  field :access_token, :type => String
  field :refresh_token, :type => String

  validates :user, :uniqueness => { :scope => :provider }
  
  before_create :before_create
  after_create :provider_created

  def before_create
  	self.company = user.company
  end

  def provider_created
  	# setup company connection
  	company.connect_provider provider
  	credentials_created
  end

  def credentials_created
  	created_method = "#{provider.name}_credentials_created"
  	send(created_method) if self.respond_to? created_method
  end

  def appfigures_credentials_created
  	 Appfigures::SetupService.perform_async(company.id)
  end
end
