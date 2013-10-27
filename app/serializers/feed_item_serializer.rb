class FeedItemSerializer < ActiveModel::Serializer
  attribute :provider_name, key: :provider
	attribute :event_name, key: :event
  attributes :id, :timestamp, :html_url, :updated_at
  attributes :card_type, :property, :action
  has_many :messages

  def messages_count
  	object.messages.count
  end

end
