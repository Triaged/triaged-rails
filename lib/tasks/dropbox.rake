namespace :dropbox do
  desc "TODO"
  

  task delta: :environment do
  	Rails.logger.info "Rake Task: dropbox:delta started"
  	companies = ProviderCredential.where(provider: Provider.named("dropbox")).collect{|credential| credential.company}.uniq
		companies.each do |company|
			Rails.logger.info company.name
			Rails.logger.info "----------"
  		Dropbox::DeltaService.new(company.id).fetch_delta
  	end
  	Rails.logger.info "Rake Task: dropbox:delta complete"
  end

  

end
