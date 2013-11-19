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
	field :push_enabled, type: Boolean, default: true
	field :validated_belongs_to_company, type: Boolean, default: false
	field :company_validation_token, type: String
	field :personal, :type => Boolean, :default => false

	belongs_to :company
	index({ company_id: 1 })

	embeds_many :push_tokens
  before_create :assign_to_company
  after_create :send_verify_email

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

		if is_email_personal(email_address)
			self.company = Company.create_placeholder_company
			self.validated_belongs_to_company = true
			self.personal = true
		else 
			self.company = Company.find_or_create_by(name: email_host)
			company_validation_token = Tokenizer.unique_token(6)
		end
	end

	def send_verify_email
		VerifyEmail.new(self.id).deliver! unless self.personal
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

	slug :name, :scope => :company do |object|
    object.name.delete(' ')
  end
end
