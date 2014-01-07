class Cards::Base < FeedItem

	belongs_to :provider
	belongs_to :provider_account

	
	field :provider_name, :type => String
	field :event_name, type: String
	field :property_name, :type => String


	before_create :set_provider_name
	before_create :set_event_name


	def set_provider_name
		self.provider = provider_from_name unless self.provider
		self.provider_name = self.provider.name
	end

	def set_event_name
		self.event_name = self.class.name.split("::").last.underscore unless self.event_name
	end


	#
	# Subclass naming
	#

	def provider_from_name
		Provider.find_by name: self.class.name.split("::").first.underscore
	end

	
end