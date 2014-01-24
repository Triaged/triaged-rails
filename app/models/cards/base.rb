class Cards::Base < FeedItem
	include Mongoid::Document

	belongs_to :provider
	belongs_to :provider_account

	field :provider_name, :type => String
	field :event_name, :type => String
	field :provider_account_name, :type => String
	
	def after_build_hook company
		super
		
		self.provider = Provider.named(self.provider_name)

		# Set timestamp if we don't already have one
		card.timestamp = payload[:timestamp] unless card.timestamp

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, card.provider)

	end

	def should_collapse?
		self.class.name == "Cards::EventSet" && self.events.count == 1
	end
	
end