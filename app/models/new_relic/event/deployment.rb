class NewRelic::Event::Deployment < FeedItem
  include Mongoid::Document

  field :application_name, :type => String
  field :account_name, :type => String
  field :changelog, :type => String
  field :description, :type => String
  field :revision, :type => String
  field :deployed_by, :type => String
  field :version, :type => String

  
	def self.build_from_webhook data
		event = NewRelic::Event::Deployment.new(
			external_id: data.id,
			event_created_at: data.created_at,
			application_name: data.application_name,
			account_name: data.application_name,
			changelog: data.changelog,
			description: data.description,
			revision: data.revision,
			deployed_by: data.deployed_by,
			version: data.version
		)
	end

end