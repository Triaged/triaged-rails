class Cards::Base < FeedItem

	belongs_to :provider
	belongs_to :provider_account

	field :external_id, type: String
	field :html_url, :type => String
	field :provider_name, :type => String
	field :property_name, :type => String

	#validates_uniqueness_of :external_id
	validates :external_id, :uniqueness => { :scope => [:company, :provider] }
	index({ "external_id" => 1 })


	before_create :set_provider_name


	def set_provider_name
		self.provider = provider_from_name unless self.provider
	end


	#
	# Subclass naming
	#

	def provider_from_name
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.underscore
	end

	def event_name
		self.class.name.split("::").last.underscore
	end

	def human_event_name
		event_name.humanize
	end

end