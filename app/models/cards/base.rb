class Cards::Base < FeedItem
	include Mongoid::Document

	belongs_to :provider
	belongs_to :provider_account

	field :provider_name, :type => String
	fiel :event_name, :type => String
	
	def after_build_hook company
		super
		set_provider
	end

	def set_provider
		self.provider = Provider.named(self.provider_name)
	end
	
end