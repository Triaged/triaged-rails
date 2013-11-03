class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
	include Deviseable
	include Providable
	include UserFeedable
	include Ignorable
	include Providable

	mount_uploader :avatar, AvatarUploader
	field :push_disabled, type: String, default: false

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
  	email_address = Mail::Address.new(email)

  	self.company = is_email_personal(email_address) 
  									? Company.create_placeholder_company(email_address.local) 
  									: Company.find_or_create_by(name: email_host)
	end

	def is_email_personal email_address
		text=File.open("#{Rails.root}/emails.txt").read
		text.each_line do |line|
			return true if (email_address.domain == line.strip)
		end
		false
	end

	def teammates
		self.company.teammates_of self
	end

	def provider_settings
		provider_settings = {}
		Provider.all.each do |provider|
			provider_settings[provider.name] = provider.settings_for(company)
		end

		return provider_settings
	end

	slug :name, :scope => :company do |object|
    object.name.delete(' ')
  end
end
