class WebhookInstructions < MandrillClient


	def initialize(user_id, provider_id)
		@user = User.find(user_id)
		@provider = Provider.find(provider_id)
		@recipient_email, @recipient_name = @user.email, @user.name
	end

	def merge_vars
		[{
			:name => 'WEBHOOK',
			:content => @provider.webhook_url_for_company(@user.company)
		}]
	end

	def template
		"#{@provider.name.gsub("_", "-")}-connect"	
	end
end
