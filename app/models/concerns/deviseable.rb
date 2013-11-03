module Deviseable
	extend ActiveSupport::Concern

	included do 
		# Include default devise modules. Others available are:
	  # :token_authenticatable, :confirmable,
	  # :lockable, :timeoutable and :omniauthable
	  devise :database_authenticatable, :registerable,# :confirmable,
	         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
		before_save :ensure_authentication_token!	         

	  ## Database authenticatable
	  field :email,              :type => String, :default => ""
	  field :encrypted_password, :type => String, :default => ""

	  ## Recoverable
	  field :reset_password_token,   :type => String
	  field :reset_password_sent_at, :type => Time

	  ## Rememberable
	  field :remember_created_at, :type => Time

	  ## Trackable
	  field :sign_in_count,      :type => Integer, :default => 0
	  field :current_sign_in_at, :type => Time
	  field :last_sign_in_at,    :type => Time
	  field :current_sign_in_ip, :type => String
	  field :last_sign_in_ip,    :type => String

	  ## Omniauth

	  ## Confirmable
	  field :confirmation_token,   :type => String
	  field :confirmed_at,         :type => Time
	  field :confirmation_sent_at, :type => Time
	  field :unconfirmed_email,    :type => String # Only if using reconfirmable

	  ## Lockable
	  # field :failed_attempts, :type => Integer, :default => 0 # Only if lock strategy is :failed_attempts
	  # field :unlock_token,    :type => String # Only if unlock strategy is :email or :both
	  # field :locked_at,       :type => Time

	  ## Token authenticatable
	  field :authentication_token, :type => String
	  # run 'rake db:mongoid:create_indexes' to create indexes
	  index({ email: 1 }, { unique: true, background: true })
	  field :name, :type => String
	  
	  validates_presence_of :name
	  validates_presence_of :encrypted_password
		validates :email, :presence => true
	end

  def ensure_authentication_token!
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end
 
  private
  
  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end

end