class Crashlytics::Event::Verification < BaseServiceEvent

	def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, event_name: self.event_name,
			title: 	"Crashlytics Verified",
			push_notify: true,
			external_id: "crsh-#{DateTime.now}",
			description: "Crashlytics issues are now synced with Triage.",
			timestamp: DateTime.now,
		}
		return event.to_json
	end
end