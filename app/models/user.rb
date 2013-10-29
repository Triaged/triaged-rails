class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
	include Deviseable
	include Providable
	include Feedable
	include Ignorable

	mount_uploader :avatar, AvatarUploader

	belongs_to :company
	index({ company_id: 1 })

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

	def teammates
		self.company.teammates_of self
	end

	def provider_credentials
		company.provider_credentials
	end

	def provider_settings
		provider_settings = {}
		Provider.all.each do |provider|
			connected = company.provider_connected? provider
			 attrs = {
				id: provider.id,
				name: provider.name,
				connected: connected
			}
			attrs[:webhook_url] = provider.webhook_url_for_company(company) if provider.webhooks_enabled
			
			provider_settings[provider.name] = attrs
		end
		return provider_settings
	end

	slug :name, :scope => :company do |object|
    object.name.delete(' ')
  end
end
