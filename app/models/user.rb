class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  include Deviseable
	include Providable
	include UserFeedable
	include Ignorable
	include Providable
	extend FriendlyId
	friendly_id :name, use: [:slugged, :finders, :scoped], :scope => [:company]

	mount_uploader :avatar, AvatarUploader

	belongs_to :company
	has_many :feed_items
	has_many :push_tokens
	has_many :notifications

  before_create :before_creation
  after_create :send_verify_email
  
  #include Mongoid::Slug

  # Overriding the method in Devise's :validatable module so password is not required on inviting
  def password_required?
    self.registered && super
  end

  
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

	def name
		"#{self.first_name} #{self.last_name}"
	end

	def full_name(name)
		self.first_name = name.split.first
		self.last_name = name.split.last
	end

	

  def before_creation
  	set_company
  	self.first_name = self.first_name.titleize if self.first_name
  	self.last_name = self.last_name.titleize if self.last_name
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

	# slug :scope => :company do |object|
	# 	# Hack to ensure the company is set befure the slug is created
	# 	object.set_company
 #    object.name.delete(' ')
 #  end
end
