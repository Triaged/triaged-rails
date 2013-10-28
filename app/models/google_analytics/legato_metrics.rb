class GoogleAnalytics::LegatoMetrics
  extend Legato::Model
	metrics :pageviews, :visitors, :visits

	dimensions :date

	def self.build_daily_summary metrics
		item = GoogleAnalytics::Status::Daily.new(
			external_id: metrics.end_date.to_i,
			date: metrics.end_date,
			timestamp: DateTime.now
		)

		# Visits
		visits_data_set = item.data_sets.build(
												label: "visits",
												total_count: metrics.totals_for_all_results["visits"]
											)
		# Visitors
		visitors_data_set = item.data_sets.build(
												label: "visitors",
												total_count: metrics.totals_for_all_results["visitors"]
											)
		# Page views
		pageviews_data_set = item.data_sets.build(
												label: "page views",
												total_count: metrics.totals_for_all_results["pageviews"]
											)
		# Details
		metrics.collection.each do |daily_detail|
			day_of_week = DateTime.parse(daily_detail.date).wday
			visits_data_set.push(details: 		{:x => day_of_week.to_f, 	:y => daily_detail.visits.to_f})
			visitors_data_set.push(details: 	{:x => day_of_week.to_f, 	:y => daily_detail.visitors.to_f})
			pageviews_data_set.push(details: 	{:x => day_of_week.to_f, 	:y => daily_detail.pageviews.to_f})
		end

		return item
	end
end