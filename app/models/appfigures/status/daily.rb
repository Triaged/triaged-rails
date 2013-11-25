class Appfigures::Status::Daily < FeedItem
  include Mongoid::Document

  field :date, type: Date
  field :property_id, type: String

  embeds_many :data_sets, :class_name => "Appfigures::Status::DataSet", cascade_callbacks: true

  def app
		company.default_appfigures_account.provider_properties.where(id: self.property_id).first
	end

  def self.build_daily_summary start_date, end_date, data, company
  	apps = {}

		data.each do |date, apps_data|
			apps_data.keys.each do |app_id|
				apps[app_id] = []
			end
		end
	
		data.each do |date, apps_data|
			apps_data.each do |app_id, sales_data|
				apps[app_id] << sales_data
			end
		end

		
		feed_items = []
		apps.each do |key, value|
			feed_items << self.build_app_summary(company, end_date, key, value)
		end

		return feed_items
	end

	def self.build_app_summary company, end_date, app_id, results

  	product = Appfigures::ProductService.new(company).find_or_create_product(app_id)

		item = Appfigures::Status::Daily.new(
			external_id: "#{product.external_id}#{end_date.to_i}",
			date: end_date,
			timestamp: DateTime.now,
			property_id: product.id
		)


		downloads_data_set = item.data_sets.build(label: "downloads")
		revenue_data_set = item.data_sets.build(label: "revenue")
		returns_data_set = item.data_sets.build(label: "returns")

		results.each_with_index do |result, index|
			downloads_data_set.push(details: {:x => index, :y => result["downloads"], :index => index})
			revenue_data_set.push(details: 	{:x => index, 	:y => result["revenue"].to_f, :index => index})
			returns_data_set.push(details: 	{:x => index, 	:y => result["returns"], :index => index})
		end

		downloads_data_set.total_count = downloads_data_set.details.last[:y]
		revenue_data_set.total_count = revenue_data_set.details.last[:y]
		returns_data_set.total_count = returns_data_set.details.last[:y]

		max = downloads_data_set.total_count || revenue_data_set.total_count || returns_data_set.total_count
			
		return item

	end
end
