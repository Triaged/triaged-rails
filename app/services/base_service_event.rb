class BaseServiceEvent

	def provider_from_name
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.underscore
	end

	


end