class MandrillClient
	class_attribute :template

	attr_accessor :recipient_email, :recipient_name, :from_email, :from_name

	def deliver!
		# raise StandardError "Template Required" unless template
		# raise StandardError "Template Content Required" unless template_content
		# raise StandardError "Recipient Email Required" unless recipient_email
		response = MANDRILL.messages.send_template template, template_content, message
		Rails.logger.info(response)
	end

	def template_content
		[]
	end

	def message
		{
			:from_email => from_email,
			:from_name => from_name,
			:to => [
				{:email=> @recipient_email, :name => @recipient_name }
			],
			:merge_vars => [
         	{
         		:vars => merge_vars,
          	:rcpt => @recipient_email
        	}
        ]
		}
	end

	def from_email
		'team@triaged.co'
	end

	def from_name
		"Triage"
	end

end