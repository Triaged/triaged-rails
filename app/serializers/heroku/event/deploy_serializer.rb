class Heroku::Event::DeploySerializer < TextItemSerializer
	#attributes :app, :user, :git_log, :head_long, :head, :previous_head

	def property
		object.app.capitalize
	end

	def action
		"Deploy by #{object.user}"
	end

	def body
		body = object.git_log.take(5).collect {|commit| "- #{commit.capitalize}" }.join("\n")
		body += "\nand #{object.git_log.count - 5} more" if object.git_log.count > 5
		return body
	end
end