class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	object.property.name
  end

  def action
  	"#{object.date.strftime('%A, %b')} #{object.date.day.ordinalize}"
  end
end
