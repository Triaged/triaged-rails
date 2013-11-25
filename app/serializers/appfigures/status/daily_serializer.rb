class Appfigures::Status::DailySerializer < GraphItemSerializer
  
	def property
  	object.app.name
  end

  def action
  	"#{object.date.strftime('%A, %b')} #{object.date.day.ordinalize}"
  end
end
