class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	"@todo"
  end

  def action
  	"#{object.date.strftime('%A, %b')} #{object.date.day.ordinalize}"
  end
end
