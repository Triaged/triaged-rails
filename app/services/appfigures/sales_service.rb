class Appfigures::SalesService < Appfigures::BaseService

	def fetch_sales
		start_date = (DateTime.now - 7.day).to_date.to_s
		end_date = (DateTime.now - 1.day).to_date.to_s

		results = RestClient.get "https://api.appfigures.com/v2/sales/dates+products?start_date=#{start_date}&end_date=#{end_date}&granularity=daily", headers
	
		results = JSON.parse(results)

		Rails.logger.info results

		item = Appfigures::Status::Daily.build_daily_summary(start_date, end_date, results, @company)

		Common::FeedService.add_to_feed item, @company

	end

end