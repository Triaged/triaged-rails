class GoogleAnalytics::Status::DailyDetail
	include Mongoid::Document

	field :date, type: Date
  field :visits_count, type: Integer
  field :visitors_count, type: Integer
  field :pageviews_count, type: Integer

	embedded_in :daily, :class_name => "GoogleAnalytics::Status::Daily"

end