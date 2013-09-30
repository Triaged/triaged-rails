class NewRelic::Event::DeploymentSerializer < EventSerializer
  attributes :application_name, :account_name, :changelog, :description, :revision, :deployed_by, :version
end
