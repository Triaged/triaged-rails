class NewRelic::Event::Deployment < Cards::Event
  include Mongoid::Document

 	def self.build_from_webhook data, company

		# event = NewRelic::Event::Deployment.new(
		# 	external_id: data.external_id,
		# 	timestamp: data.created_at,
		# 	application_name: data.application_name,
		# 	account_name: data.application_name,
		# 	changelog: data.changelog,
		# 	description: data.description,
		# 	revision: data.revision,
		# 	deployed_by: data.deployed_by
		# )

		event = NewRelic::Event::Deployment.new(
			external_id: data.external_id,
			property_name: data.application_name,
			title: "Deployment",
			body: data.description
		)
	end

end