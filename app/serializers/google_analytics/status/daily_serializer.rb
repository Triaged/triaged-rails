class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	"@todo"
  end

  def action
  	Rails.logger.info object.date.to_s
  	Date.strptime(object.date.to_s, '%A, %b %d')
  end
end
