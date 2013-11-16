class VerifyEmail < MandrillClient
	include Rails.application.routes.url_helpers
  
def initialize(user_id)
		@user = User.find(user_id)
		@recipient_email, @recipient_name = @user.email, @user.name
	end

	def merge_vars
		[{
			:name => 'FNAME',
			:content => @user.name.split.first
		},
		{
			:name => 'VLINK',
			:content => verify_email_url(:id => @user.id, :token => @user.company_validation_token)
		}]
	end

	def template
		:verify
	end


end
