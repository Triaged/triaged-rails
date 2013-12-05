class WelcomeController < ApplicationController

	before_filter :check_for_mobile

	def index
	end

	def support
	end

	def faq
	end

	def terms
	end

	def capture_email
	  Common::CaptureEmail.subscribe(params[:email_capture][:email])
	  @response =  "Great, we will be in touch shortly!"
	end

	def deliver_sms
		sms_app_link = Common::SmsService.new(params[:sms_delivery][:phone_number])
    result = sms_app_link.deliver!
    
    @response =  result ? "Great, we sent you a text message!" : "Sorry, your phone number looks invalid."
	end
end
