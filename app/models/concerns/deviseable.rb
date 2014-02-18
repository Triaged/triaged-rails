module Deviseable
	extend ActiveSupport::Concern

	included do 
		# Include default devise modules. Others available are:
	  # :token_authenticatable, :confirmable,
	  # :lockable, :timeoutable and :omniauthable
	  devise :database_authenticatable, :registerable,# :confirmable,
	         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
		before_save :ensure_authentication_token!	         

	  validates_presence_of :name, :if => :registered
	  validates_presence_of :encrypted_password, :if => :registered
		validates :email, :presence => true
	end

  def ensure_authentication_token!
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  # Only verify password when registered
  def valid_password?(password)
    super if registered
  end


 
protected

	
  
  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end

end