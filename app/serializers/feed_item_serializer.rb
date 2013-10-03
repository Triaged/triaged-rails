class FeedItemSerializer < ActiveModel::Serializer
  attribute :provider_name, key: :provider
	attribute :event_name, key: :event
  attributes :id, :timestamp, :url


  has_many :messages

  def messages_count
  	object.messages.count
  end

end
