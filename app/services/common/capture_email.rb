module Common::CaptureEmail
	

	DEFAULT_LIST_ID = "a8a5ce64f7"

	def self.subscribe(email)
		response = MAILCHIMP.listSubscribe({:id => DEFAULT_LIST_ID, :email_address => email})
		Rails.logger.info(response)
	end

end