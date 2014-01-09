class BaseServiceEvent

	def provider_from_name
		Provider.find_by name: self.provider_name
	end

	def self.provider_name
		self.name.split("::").first.underscore
	end

	def self.event_name
		self.name.split("::").last.underscore
	end

	


end