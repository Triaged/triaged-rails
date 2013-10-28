class Heroku::Event::DeploySerializer < TextItemSerializer
	#attributes :app, :user, :git_log, :head_long, :head, :previous_head

	def property
		object.app.capitalize
	end

	def action
		"Deploy"
	end

	def body
		object.git_log
	end
end