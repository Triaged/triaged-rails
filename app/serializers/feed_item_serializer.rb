class FeedItemSerializer < ApplicationSerializer
	# cached
 #  delegate :cache_key, to: :object
 
  attributes :id, :timestamp, :updated_at
  has_many :messages
  has_one :provider
  has_one :author, key: :user
  attributes :event_name, :messages_count
  attributes :type, :external_id, :timestamp, :title, :body, :footer, :url, :property_name, :image_url, :thumbnail_url

  def messages_count
  	object.messages.count
  end



  def type
    :event
  end

  def body
    object.body || object.body_list.collect {|entry| "- #{entry}" }.join("\n")
  end

  def image_url
    object.event_image.ios.url
  end

  def list_helper list
  	return list.first.capitalize if (list.count == 1)
  	
  	body = list.take(5).collect {|entry| "- #{entry.capitalize}" }.join("\n")
		body += "\nand #{list.count - 5} more" if list.count > 5
		return body
  end

end
