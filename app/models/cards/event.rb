class Cards::Event < FeedItem
	include Mongoid::Document

	belongs_to :provider
	belongs_to :provider_account

	field :provider_name, :type => String
	field :event_name, :type => String

	field :account_name, :type => String
 	field :property_name, :type => String

	field :external_id, type: String
	
	field :title, type: String
	field :body, type: String
	field :body_list, type: Array
	field :footer, type: String
	field :url, type: String
	
	field :thumbnail_url, type: String
	field :image_url, type: String
	field :icon, type: String
	field :mime_type, type: String

	field :group_event, type: Boolean, default: false

	embeds_one :author, class_name: "Cards::Author"

	validates :provider, presence: true
	validates :title, presence: true
	validates :external_id, presence: true
	#validates :body, presence: true, :unless => :body_list
	#validates :body_list, presence: true, :unless => :body

	def after_build_hook company, payload
		super
		
		self.provider = Provider.named(self.provider_name)

		# Set timestamp if we don't already have one
		self.timestamp = payload[:timestamp] unless self.timestamp

		# condense body list if only one entry exists
		if self.body_list.exists? && self.body_list.count == 1
			self.body = self.body_list.first
			self.body_list = nil
		end

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, self.provider)

	end


end
