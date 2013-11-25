class Appfigures::ReviewsService < Appfigures::BaseService

	def fetch_reviews
		result = RestClient.get "https://api.appfigures.com/v2/reviews?count=100&sort=date", headers #&start=#{Date.today}
		result = JSON.parse(result)
		build_reviews result["reviews"]
	end

	def build_reviews reviews
		reviews.each do |review|
			review = RecursiveOpenStruct.new(review)

			product = Appfigures::ProductService.new(@company).find_or_create_product(review.product)

			item = Appfigures::Event::Review.new(
				author: review.author,
				title: review.title,
				review: review.review,
				stars: review.stars.to_i,
				iso: review.iso,
				external_id: review.id,
				timestamp: review.date,
				property_id: product.id.to_s
			)

			#add to feed
			Common::FeedService.add_to_feed item, @company
		end

	end

end