class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  #attributes :date, :visits_sum, :visitors_sum, :pageviews_sum

  #has_many :daily_details

  def property
  	"@todo"
  end
end
