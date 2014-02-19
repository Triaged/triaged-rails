class Cards::Event < FeedItem
	
	
	#validates :body, presence: true, :unless => :body_list
	#validates :body_list, presence: true, :unless => :body

	def after_build_hook company, payload
		super
		
		# Set timestamp if we don't already have one
		self.timestamp = payload[:timestamp] unless self.timestamp

		# Set Provider name
		self.provider_name = self.provider.name

		# condense body list if only one entry exists
		if !self.body_list.nil? && self.body_list.count == 1
			self.body = self.body_list.first
			self.body_list = nil
		end

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, self.provider)

	end


end
