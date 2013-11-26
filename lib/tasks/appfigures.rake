namespace :appfigures do
  desc "TODO"
  

  task daily_status: :environment do
  	Rails.logger.info "Rake Task: appfigures:daily_status started"
  	companies = ProviderCredential.where(provider: Provider.named("appfigures")).collect{|credential| credential.company}.uniq
		companies.each do |company|
			Rails.logger.info company.name
			Rails.logger.info "----------"
  		Appfigures::SalesService.new(company.id).fetch_sales
  	end
  	Rails.logger.info "Rake Task: appfigures:daily_status complete"
  end

  task reviews: :environment do
  	Rails.logger.info "Rake Task: appfigures:daily_status started"
  	companies = ProviderCredential.where(provider: Provider.named("appfigures")).collect{|credential| credential.company}.uniq
		companies.each do |company|
			Rails.logger.info company.name
			Rails.logger.info "----------"
  		Appfigures::ReviewsService.new(company.id).fetch_reviews
  	end
  	Rails.logger.info "Rake Task: appfigures:daily_status complete"
  end

end
