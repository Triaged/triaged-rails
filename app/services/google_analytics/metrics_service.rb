class GoogleAnalytics::MetricsService < GoogleAnalytics::BaseService

	attr_accessor :metrics_class

	def initialize metrics_class, company_id
		@metrics_class = metrics_class
		@company = Company.find(company_id)
	end

	def fetch_and_add_to_feed(start_date, end_date)
		user = Legato::User.new(access_token)
		account = @company.default_google_analytics_account

		legato_profiles(user).each do |profile|
			metrics = fetch_metrics(profile, start_date, end_date)
			add_to_feed metrics, profile
		end
	end

	def fetch_metrics(profile, start_date, end_date)
		@metrics_class.results(profile, :start_date => start_date, :end_date => end_date) # kicks off fetch
	end

	def add_to_feed metrics, profile
		item = build_item_from_metrics metrics, profile
		Common::FeedService.add_to_feed item, @company
	end

	def daily_fetch_and_add_to_feed
		fetch_and_add_to_feed(7.days.ago, 1.day.ago)
	end

private

	def build_item_from_metrics metrics, profile
		item = @metrics_class.build_daily_summary metrics, profile
	end

	def get_legato_properties user, account
		Legato::Management::Account.all(user).each do |legato_account|
			return legato_account if (legato_account.id == account.external_id)
		end
		return nil
	end

	def legato_profiles user
		Legato::Management::Profile.all(user).select {|profile| profile.name == "All Web Site Data"}
	end

end