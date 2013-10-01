class EventSerializer < ActiveModel::Serializer
  attribute :provider_name, key: :provider
	attribute :event_name, key: :event
	attribute :messages_count
  attributes :id, :timestamp


  has_many :messages

  def messages_count
  	object.messages.count
  end

end
