class GoogleAnalytics::Status::DailySerializer < ActiveModel::Serializer
  attributes :provider, :event, :id, :date, :visits_sum, :visitors_sum, :pageviews_sum

  has_many :daily_details

  def provider
		"google_analytics"
	end

	def event
		"daily"
	end
end
