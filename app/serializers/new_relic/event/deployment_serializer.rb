class NewRelic::Event::DeploymentSerializer < FeedItemSerializer
  attributes :application_name, :account_name, :changelog, :description, :revision, :deployed_by, :version
end
