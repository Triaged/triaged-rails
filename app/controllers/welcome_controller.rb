class WelcomeController < ApplicationController

	before_filter :check_for_mobile, :only => :index

	def index
	end

	def deliver_sms
		sms_app_link = Common::SmsService.new(params[:sms_delivery][:phone_number])
    result = sms_app_link.deliver!
    
    @response =  result ? "Great, we sent you a text message!" : "Sorry, your phone number looks invalid."
	end
end
