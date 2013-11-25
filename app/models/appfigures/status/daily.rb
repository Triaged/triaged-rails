class Appfigures::Status::Daily < FeedItem
  include Mongoid::Document

  field :date, type: Date
  field :property_id, type: String

  embeds_many :data_sets, :class_name => "Appfigures::Status::DataSet", cascade_callbacks: true

  def app
		company.default_appfigures_account.provider_properties.where(id: self.property_id).first
	end

  def self.build_daily_summary start_date, end_date, data, company
  	
  	#product = company.default_appfigures_account.provider_properties.first
  	product = Appfigures::ProductService.new(company).find_or_create_product(review.product)

		item = Appfigures::Status::Daily.new(
			external_id: "#{product.external_id}#{end_date.to_i}",
			date: end_date,
			timestamp: DateTime.now,
			property_id: product.id
		)


		downloads_data_set = item.data_sets.build(label: "downloads")
		revenue_data_set = item.data_sets.build(label: "revenue")
		returns_data_set = item.data_sets.build(label: "returns")



		data.keys.each_with_index do |key, index|
			result = data[key]["39771362377"]
			Rails.logger.info key
			downloads_data_set.push(details: {:x => key.to_i, :y => result["downloads"], :index => index})
			revenue_data_set.push(details: 	{:x => key.to_i, 	:y => result["revenue"].to_f, :index => index})
			returns_data_set.push(details: 	{:x => key.to_i, 	:y => result["returns"], :index => index})

		end

		downloads_data_set.total_count = downloads_data_set.details.last[:y]
		revenue_data_set.total_count = revenue_data_set.details.last[:y]
		returns_data_set.total_count = returns_data_set.details.last[:y]

		max = downloads_data_set.total_count || revenue_data_set.total_count || returns_data_set.total_count
			
		return item
	end
end
