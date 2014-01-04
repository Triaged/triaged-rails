class Crashlytics::Event::VerificationSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Crashlytics"
	end

	def action
		"Verification Succeeded"
	end

	def body
		"Crashlytics issues are now synced with Triage."
	end
end