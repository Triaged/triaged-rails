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

		# Visitors
		visitors_total_count = metrics.totals_for_all_results["visitors"]
		if (visitors_total_count > 0)
			visitors_data_set = item.data_sets.build(label: "visitors")

			metrics.collection.each_with_index do |daily_detail, index|
				visitors_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.visitors.to_f, :index => index})
			end

			visitors_data_set.total_count = visitors_data_set.details.last[:y]
		end

		# Visits
		visits_total_count = metrics.totals_for_all_results["visits"]
		if (visits_total_count > 0)
			visits_data_set = item.data_sets.build(label: "visits") 

			metrics.collection.each_with_index do |daily_detail, index|
				visits_data_set.push(details: 		{:x => daily_detail.date.to_i, 	:y => daily_detail.visits.to_f, :index => index})
			end

			visits_data_set.total_count = visits_data_set.details.last[:y]
		end
		
		# Page views
		pageviews_total_count = metrics.totals_for_all_results["pageviews"]
		if (pageviews_total_count > 0)
			pageviews_data_set = item.data_sets.build(label: "pageviews")

			metrics.collection.each_with_index do |daily_detail, index|
				pageviews_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.pageviews.to_f, :index => index})
			end

			pageviews_data_set.total_count = pageviews_data_set.details.last[:y]
		end
		
		# # Details
		# metrics.collection.each_with_index do |daily_detail, index|
		# 	#date = DateTime.parse()
		# 	visits_data_set.push(details: 		{:x => daily_detail.date.to_i, 	:y => daily_detail.visits.to_f, :index => index}) if (visits_total_count > 0)
		# 	visitors_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.visitors.to_f, :index => index}) if (visitors_total_count > 0)
		# 	pageviews_data_set.push(details: 	{:x => daily_detail.date.to_i, 	:y => daily_detail.pageviews.to_f, :index => index}) if (pageviews_total_count > 0)
		# end

		# visits_data_set.total_count = 

		return item.data_sets.empty? ? nil : item
	end

end