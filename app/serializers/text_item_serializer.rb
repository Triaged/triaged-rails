class TextItemSerializer < FeedItemSerializer
  
  attributes :body

  def body
  	""
  end
  
  def card_type
  	:text
  end
end
