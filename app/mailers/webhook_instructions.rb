class WebhookInstructions < MandrillClient
	self.template = "welcome"

	def initialize(user_id, provider_id)
		@user = User.find(user_id)
		@provider = Provider.find(provider_id)
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
		:webhook
	end
end
