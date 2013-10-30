class GoogleAnalytics::MetricsService

	attr_accessor :company, :metrics_class

	def initialize metrics_class, company_id
		@metrics_class = metrics_class
		@company = Company.find(company_id)
	end

	def fetch_and_add_to_feed(start_date, end_date)
		metrics = fetch_metrics(start_date, end_date)
		item = build_item_from_metrics metrics
		Common::FeedService.add_to_feed item, @company
	end

	def fetch_metrics(start_date, end_date)
		user = Legato::User.new(access_token)
		profile = user.profiles.last # todo, configure this
		metrics = @metrics_class.results(profile, :start_date => start_date, :end_date => end_date) # kicks off fetch
	end

	def daily_fetch_and_add_to_feed
		fetch_and_add_to_feed(7.days.ago, 1.day.ago)
	end

private

	def build_item_from_metrics metrics
		item = @metrics_class.build_daily_summary metrics
	end

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
	    :refresh_token => @company.default_google_analytics_provider_credentials.refresh_token,
	    :grant_type => "refresh_token"
	  }
	  @response = ActiveSupport::JSON.decode(RestClient.post "https://accounts.google.com/o/oauth2/token", data)
	  if @response["access_token"].present?
	  	token = @response["access_token"]
	  	@company.default_google_analytics_provider_credentials.update_attribute(:access_token, token)
	  	return token
	  else
	    raise StandardError
	  end
	rescue RestClient::BadRequest => e
	  # Bad request
	end
end