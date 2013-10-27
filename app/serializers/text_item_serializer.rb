class TextItemSerializer < FeedItemSerializer
  
  attributes :body
  
  def card_type
  	:text
  end
end
