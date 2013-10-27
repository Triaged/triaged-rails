class FeedItemSerializer < ActiveModel::Serializer
  attribute :provider_name, key: :provider
	attribute :event_name, key: :event
  attributes :id, :timestamp, :html_url, :updated_at
  attribute :card_type
  attribute :property


  has_many :messages

  def messages_count
  	object.messages.count
  end

end
