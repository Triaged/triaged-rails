class HockeyApp::Event::FeedbackSerializer < TextItemSerializer
	#attributes :app, :user, :git_log, :head_long, :head, :previous_head

	def property
		object.title.capitalize
	end

	def action
		"New Feedback from #{object.name}"
	end

	def body
		"#{object.subject}\n#{object.text}"
	end

end
