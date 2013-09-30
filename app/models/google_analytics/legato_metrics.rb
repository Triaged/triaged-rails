class GoogleAnalytics::LegatoMetrics
  extend Legato::Model
	metrics :pageviews, :visitors, :visits

	dimensions :date

	def self.build_daily_summary metrics
		daily_details = []
		metrics.collection.each do |daily_detail|
			daily_details << GoogleAnalytics::Status::DailyDetail.new(
				date: Date.parse(daily_detail.date),
				visits_count: daily_detail.visits,
				visitors_count: daily_detail.visitors,
				pageviews_count: daily_detail.pageviews
			)
		end
		
		item = GoogleAnalytics::Status::Daily.new(
			external_id: metrics.end_date.to_date,
			date: metrics.end_date,
			visits_sum: metrics.totals_for_all_results["visits"],
			visitors_sum: metrics.totals_for_all_results["visitors"],
			pageviews_sum: metrics.totals_for_all_results["pageviews"],
			daily_details: daily_details,
			timestamp: DateTime.now
		)
	end
end