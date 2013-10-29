class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  #attributes :date, :visits_sum, :visitors_sum, :pageviews_sum

  def property
  	"@todo"
  end

  def action
  	Date.strptime(object.date.to_s, '%A %b %d, %Y')
  end
end
