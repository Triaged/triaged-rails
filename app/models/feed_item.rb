class FeedItem
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :company
  embeds_many :messages, class_name: "Messages::Message"

  field :external_id, type: String
  field :timestamp, type: DateTime

  index({ external_id: 1 }, { unique: true, background: true })
	validates_uniqueness_of :external_id

	def provider
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.downcase
	end

	def event_name
		self.class.name.split("::").last.underscore
	end


end
