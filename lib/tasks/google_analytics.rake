namespace :google_analytics do
  desc "TODO"
  

  task daily_status: :environment do
  	Rails.logger.info "Rake Task: google_analytics:daily_status started"
  	companies = ProviderCredential.where(provider: Provider.named("google_analytics")).collect{|credential| credential.company}.uniq
		companies.each do |company|
			begin
				Rails.logger.info company.name
				Rails.logger.info "----------"
  			GoogleAnalytics::MetricsService.new(GoogleAnalytics::LegatoMetrics, company.id).daily_fetch_and_add_to_feed
  		rescue
  			Rails.logger.info "google_analytics:daily_status failed #{company.id}"
  	end
  	Rails.logger.info "Rake Task: google_analytics:daily_status complete"
  end

end
