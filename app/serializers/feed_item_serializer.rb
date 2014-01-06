class FeedItemSerializer < ActiveModel::Serializer
	# cached
 #  delegate :cache_key, to: :object
 
  attributes :id, :timestamp, :updated_at
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
