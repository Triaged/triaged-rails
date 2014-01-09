class Crashlytics::Event::Verification < BaseServiceEvent

	def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: self.provider_name,
			title: 	"Crashlytics Verified",
			should_push: true,
			external_id: "crsh-#{DateTime.now}",
			description: "Crashlytics issues are now synced with Triage.",
			timestamp: DateTime.now,
		}
		return event.to_json
	end
end