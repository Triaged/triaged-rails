class NewRelic::Event::AppAlertSerializer < TextItemSerializer
  #attributes :application_name, :account_name, :severity, :message, :short_description, :long_description

  def property
		object.application_name
	end

	def body
		object.message
	end
end
