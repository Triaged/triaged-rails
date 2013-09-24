class FeedItem
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :company

  field :external_id
  
  index({ external_id: 1 }, { unique: true, background: true })
	validates_uniqueness_of :external_id

	def provider
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.downcase
	end


end
