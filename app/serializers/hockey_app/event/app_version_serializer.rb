class HockeyApp::Event::AppVersionSerializer < TextItemSerializer
	#attributes :app, :user, :git_log, :head_long, :head, :previous_head

	def property
		object.title.capitalize
	end

	def action
		"New Version: #{object.version}"
	end

	def body
		object.notes
	end

end
