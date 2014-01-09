class Cards::Base < FeedItem
	include Mongoid::Document

	belongs_to :provider
	belongs_to :provider_account

	field :provider_name, :type => String
	before_create :set_provider_name
	

	def set_provider_name
		self.provider_name = self.provider.name
	end

end