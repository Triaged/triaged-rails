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

#max_y_count
#dataset1
	#label
	#total_count
	#details > x,y coordinates

#dataset2

#dataset3
