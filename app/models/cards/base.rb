class Cards::Event < FeedItem

	belongs_to :provider

	field :external_id, type: String
	field :html_url, :type => String
	field :provider_name, :type => String

	#validates_uniqueness_of :external_id
	validates :external_id, :uniqueness => { :scope => [:company, :provider] }
	index({ "external_id" => 1 })


	before_create :set_provider_name


	def set_provider_name
		self.provider_name = self.provider.name
	end

end