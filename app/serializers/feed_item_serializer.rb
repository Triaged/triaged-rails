class FeedItemSerializer < ActiveModel::Serializer
	# cached
 #  delegate :cache_key, to: :object

	
  attribute :provider_name, key: :provider
	attribute :event_name, key: :event
  attributes :id, :timestamp, :html_url, :updated_at
  attributes :card_type, :property, :action
  has_many :messages

  def messages_count
  	object.messages.count
  end

  def list_helper list
  	return list.first.capitalize if (list.count == 1)
  	
  	body = list.take(5).collect {|entry| "- #{entry.capitalize}" }.join("\n")
		body += "\nand #{list.count - 5} more" if list.count > 5
		return body
  end

end
