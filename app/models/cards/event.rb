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
	field :body, type: Array
	field :footer, type: String
	field :url, type: String
	
	field :thumbnail_url, type: String
	field :image_url, type: String
	field :icon, type: String
	field :mime_type, type: String

	field :group_event, type: Boolean, default: false

	embeds_one :author, class_name: "Cards::Author"


	def after_build_hook company
		super
		
		self.provider = Provider.named(self.provider_name)

		# Set timestamp if we don't already have one
		card.timestamp = payload[:timestamp] unless card.timestamp

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, card.provider)

	end


end
