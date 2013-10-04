class User
  include Mongoid::Document
  include Mongoid::Timestamps
	include Deviseable
	include Providable
	include Feedable
	include Follower

	belongs_to :company
  embeds_many :push_tokens
	before_create :assign_to_company

  def save_omniauth(provider, uid, access_token, refresh_token=nil)
	  credentials = self.provider_credentials.find_or_create_by(company: company, provider: Provider.find_by(name: provider), uid: uid)
	  credentials.access_token = access_token if access_token
	  credentials.refresh_token = refresh_token if refresh_token
	  credentials.save!
	end

	def email_host
		email.split("@").last
	end

  def assign_to_company
		self.company = Company.find_or_create_by name: email_host
	end

	def provider_credentials
		company.provider_credentials
	end

end
