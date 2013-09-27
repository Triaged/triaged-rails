class GoogleAnalytics::Status::DailyDetailSerializer < ActiveModel::Serializer
  attributes :date, :visits_count, :visitors_count, :pageviews_count
end
