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
  validates :company, :uniqueness => { :scope => :provider }
  
  before_create :before_create
  after_create :provider_created

  def before_create
  	self.company = user.company
  end

  def provider_created
  	# setup company connection
  	company.connect_provider provider
  end



end
