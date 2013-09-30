class GoogleAnalytics::Status::DailySerializer <EventSerializer
  attributes :date, :visits_sum, :visitors_sum, :pageviews_sum

  has_many :daily_details
end
