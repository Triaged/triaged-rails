class Services::ZapierController < ServiceController
	respond_to :json

	def webhook
		Rails.logger.info params.inspect
		#event = JSON.parse(params["payload"])
		#payload = {event: event, company_id: params[:company_id], event_type: event_type}
		
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

	def token
		head :ok

	end


end
