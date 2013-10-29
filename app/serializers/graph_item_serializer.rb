class GraphItemSerializer < FeedItemSerializer

	attributes :body
	has_many :data_sets

	def body
  	"placeholder body"
  end  

  def card_type
  	:graph
  end
end
