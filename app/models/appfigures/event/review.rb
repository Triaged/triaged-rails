class Appfigures::Event::Review < FeedItem
  include Mongoid::Document

  field :author, :type => String
  field :title, :type => String
  field :review, :type => String
  field :stars, :type => Integer
  field :iso, :type => String
  field :property_id, type: String

  def app
		company.default_appfigures_account.provider_properties.where(id: self.property_id).first
	end

	def should_push?
		true
	end


end
