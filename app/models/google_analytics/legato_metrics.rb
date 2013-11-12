class GoogleAnalytics::LegatoMetrics
  extend Legato::Model
	metrics :pageviews, :visitors, :visits

	dimensions :date

	def self.build_daily_summary metrics, profile
		item = GoogleAnalytics::Status::Daily.new(
			external_id: "#{profile.web_property_id}#{metrics.end_date.to_i}",
			date: metrics.end_date,
			timestamp: DateTime.now,
			property_external_id: profile.web_property_id
		)

		# Visits
		visits_total_count = metrics.totals_for_all_results["visits"]
		visits_data_set = item.data_sets.build(
												label: "visits",
												total_count: visits_total_count
											) if (visits_total_count > 0)
		# Visitors
		visitors_total_count = metrics.totals_for_all_results["visitors"]
		visitors_data_set = item.data_sets.build(
												label: "visitors",
												total_count: visitors_total_count
											) if (visitors_total_count > 0)
		# Page views
		pageviews_total_count = metrics.totals_for_all_results["pageviews"]
		pageviews_data_set = item.data_sets.build(
												label: "page views",
												total_count: pageviews_total_count
											) if (pageviews_total_count > 0)
		

		# Details
		metrics.collection.each_with_index do |daily_detail, index|
			#date = DateTime.parse()
			visits_data_set.push(details: 		{:x => daily_detail.date.to_i, 	:y => daily_detail.visits.to_f, :index => index}) if visits_data_set
			visitors_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.visitors.to_f, :index => index}) if visitors_data_set
			pageviews_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.pageviews.to_f, :index => index}) if pageviews_data_set
		end

		Rails.logger.info item.data_sets.inspect
		Rails.logger.info "DataSet Count: #{item.data_sets.count}"
		Rails.logger.info "DataSet empty: #{item.data_sets.empty?}"
		return item.data_sets.empty? ? nil : item
	end

end