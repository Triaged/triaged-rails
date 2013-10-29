class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	"@todo"
  end

  def action
  	Rails.logger.info object.date.to_s
  	object.date.strftime('%A, %b %d')
  end
end
