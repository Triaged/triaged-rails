class NewRelic::Event::ApdexAlertSerializer < TextItemSerializer
  #attributes :application_name, :account_name, :severity, :message, :short_description, :long_description

  def property
		object.application_name
	end

	def action
		"Apdex Alert"
	end

	def body
		object.message
	end
end
