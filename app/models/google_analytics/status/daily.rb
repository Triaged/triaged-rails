class GoogleAnalytics::Status::Daily < FeedItem
  include Mongoid::Document

  field :date, type: Date
  field :visits_sum, type: Integer
  field :visitors_sum, type: Integer
  field :pageviews_sum, type: Integer
  
  embeds_many :daily_details, :class_name => "GoogleAnalytics::Status::DailyDetail"

  def provider_name
  	"google_analytics"
  end
end
