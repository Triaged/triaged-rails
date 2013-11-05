namespace :feed_items do
  desc "TODO"
  

  task :destroy_in_company, [:type, :company] => :environment do |t, args|
  	Rails.logger.info "Rake Task: feed_items:destroy_in_company to #{args[:type]} started"
  	
  	company = Company.find args[:company]
  	company.feed_items.where(:_type => args[:type]).destroy
  	
  	Rails.logger.info "Rake Task: feed_items:destroy_in_company to #{args[:type]} complete"
  end

end
