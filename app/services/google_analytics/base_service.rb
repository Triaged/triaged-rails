class GoogleAnalytics::BaseService

	attr_accessor :company

	def access_token
		token = refresh_token
		client = OAuth2::Client.new(ENV['GA_CLIENT_ID'], ENV['GA_SECRET'], {
		  :authorize_url => 'https://accounts.google.com/o/oauth2/auth',
		  :token_url => 'https://accounts.google.com/o/oauth2/token'
		})
		access_token = OAuth2::AccessToken.from_hash client, {:access_token => token}
	end

	def refresh_token
	  data = {
	    :client_id => ENV['GA_CLIENT_ID'],
	    :client_secret => ENV['GA_SECRET'],
	    :refresh_token => @company.google_analytics_provider_credentials.refresh_token,
	    :grant_type => "refresh_token"
	  }
	  @response = ActiveSupport::JSON.decode(RestClient.post "https://accounts.google.com/o/oauth2/token", data)
	  if @response["access_token"].present?
	  	token = @response["access_token"]
	  	@company.google_analytics_provider_credentials.update_attribute(:access_token, token)
	  	return token
	  else
	    raise StandardError
	  end
	rescue RestClient::BadRequest => e
	  # Bad request
	end

end