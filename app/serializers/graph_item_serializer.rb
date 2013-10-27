class GraphItemSerializer < FeedItemSerializer
  attribute :card_type

  def card_type
  	:graph
  end
end
