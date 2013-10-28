class NewRelic::Event::AppAlertSerializer < TextItemSerializer
  #attributes :application_name, :account_name, :severity, :message, :short_description, :long_description

  def property
		object.application_name.capitalize
	end

	def action
		"App Alert"
	end

	def body
		object.message
	end
end
