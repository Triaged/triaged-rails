class CompanyApp < ActiveRecord::Base
	include AppFeedable

	enum app_type: [ :web, :mobile, :service ]

  belongs_to :company
  has_one :api_token, as: :tokenable
  has_many :provider_accounts
  has_many :connected_provider_properties

  validates :name, :uniqueness => { :scope => :company_id }

  before_create :set_company_app_token

  def provider_account_for provider
  	self.provider_accounts.where(provider: provider).first
	end

	def connected_to_provider? provider
		!!provider_account_for(provider)
	end

	def set_company_app_token
		self.api_token = ApiToken.create!
  end

end
