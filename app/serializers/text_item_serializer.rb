class TextItemSerializer < FeedItemSerializer
  attribute :card_type
  attributes :body

  def card_type
  	:text
  end
end
