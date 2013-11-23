class Triage::DefaultChatSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Triage"
	end

	def action
		object.title
	end

	def body
		object.body
	end

end