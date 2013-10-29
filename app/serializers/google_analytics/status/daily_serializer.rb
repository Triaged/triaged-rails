class GoogleAnalytics::Status::DailySerializer < GraphItemSerializer
  
	def property
  	"@todo"
  end

  def action
  	"#{Date.strptime(object.date.to_s, '%Y-%M-%D')}"
  end
end
