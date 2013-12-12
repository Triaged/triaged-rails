class HockeyApp::Event::CrashReasonSerializer < TextItemSerializer
	#attributes :app, :user, :git_log, :head_long, :head, :previous_head

	def property
		object.title
	end

	def action
		"Crash"
	end

	def body
		"#{object.reason}\n\n#{object.class_name} in #{object.method_name} at #{object.line}"
	end

end
