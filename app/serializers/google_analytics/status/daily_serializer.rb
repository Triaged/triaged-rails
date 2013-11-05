class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	object.ga_property_name
  end

  def action
  	"#{object.date.strftime('%A, %b')} #{object.date.day.ordinalize}"
  end
end
