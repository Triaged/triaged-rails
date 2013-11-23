class Triage::DefaultGraphSerializer  < GraphItemSerializer
  
	def property
  	"Triage"
  end

  def action
  	object.title
  end
end