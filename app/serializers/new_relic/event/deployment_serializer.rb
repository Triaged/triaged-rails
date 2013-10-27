class NewRelic::Event::DeploymentSerializer < TextItemSerializer
  #attributes :application_name, :account_name, :changelog, :description, :revision, :deployed_by

  def property
		object.application_name
	end

	def action
		"Deployment"
	end

	def body
		object.description
	end
end
