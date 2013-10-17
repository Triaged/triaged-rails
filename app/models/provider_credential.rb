class ProviderCredential
  include Mongoid::Document

	belongs_to :company
  belongs_to :provider

  # Oauth Providers require credentials
  field :uid, :type => String
  field :access_token, :type => String
  field :refresh_token, :type => String

  validates :company, :uniqueness => { :scope => :provider }
  
  after_create :provider_created

  def provider_created
  	# setup connection
  	company.connect_provider provider
  end

end
