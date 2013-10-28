class TextItemSerializer < FeedItemSerializer
  
  attributes :body

  def body
  	"placeholder body"
  end
  
  def card_type
  	:text
  end
end
