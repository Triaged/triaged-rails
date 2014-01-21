class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include Deviseable
	include Providable
	include UserFeedable
	include Ignorable
	include Providable

	mount_uploader :avatar, AvatarUploader
	field :push_enabled, type: Boolean, default: true
	field :validated_belongs_to_company, type: Boolean, default: false
	field :company_validation_token, type: String
	field :personal, :type => Boolean, :default => false
	

	belongs_to :company
	index({ company_id: 1 })
	has_many :feed_items
	embeds_many :push_tokens

  before_create :before_creation
  after_create :send_verify_email
  include Mongoid::Slug

  
	def save_omniauth(provider, uid, access_token, token_secret: nil, refresh_token: nil)
	  credentials = self.provider_credentials.find_or_create_by(company: company, provider: Provider.named(provider), uid: uid)
	  credentials.access_token = access_token
	  credentials.token_secret = token_secret
	  credentials.refresh_token = refresh_token
	  credentials.save!
	end

	def email_host
		email.split("@").last
	end

	def first_name
		name.split.first
	end

  def before_creation
  	self.name = self.name.titleize
	end

	def set_company
		email_address = Mail::Address.new(email)

		if is_email_personal(email_address)
			self.company = Company.create_placeholder_company
			self.validated_belongs_to_company = true
			self.personal = true
		else 
			self.company = Company.find_or_create_by(name: email_host)
			self.company_validation_token = Tokenizer.unique_token(6)
		end
	end

	def send_verify_email
		VerifyEmail.perform_async(self.id.to_s) unless self.personal
		self.company.add_default_feed_items
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

	slug :scope => :company do |object|
		# Hack to ensure the company is set befure the slug is created
		object.set_company
    object.name.delete(' ')
  end
end
