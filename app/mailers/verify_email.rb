class VerifyEmail < MandrillClient
  
def initialize(user_id)
		@user = User.find(user_id)
		@recipient_email, @recipient_name = @user.email, @user.name
	end

	def template_content
		[{
			:name => 'user_name',
			:content => @user.name
		},
		{
			:name => 'user_id',
			:content => @user.id
		}]
	end

	def template
		:verify
	end


end
