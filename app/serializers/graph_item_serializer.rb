class GraphItemSerializer < FeedItemSerializer

	attributes :body

  def body
  	"placeholder body"
  end  

  def card_type
  	:graph
  end
end
