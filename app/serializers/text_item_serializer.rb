class TextItemSerializer < FeedItemSerializer
  attribute :card_type
  attributes :body
  attribute :property

  def card_type
  	:text
  end
end
