namespace :feed_items do
  desc "TODO"
  
  # heroku run rake feed_items:destroy_in_company[Heroku::Event::Deploy,triaged] --remote production
  task :destroy_in_company, [:type, :company] => :environment do |t, args|
  	Rails.logger.info "Rake Task: feed_items:destroy_in_company to #{args[:type]} started"
  	
  	company = Company.find args[:company]
  	company.feed_items.where(:_type => args[:type]).destroy
  	
  	Rails.logger.info "Rake Task: feed_items:destroy_in_company to #{args[:type]} complete"
  end

  task :clean_missing_user_feed_items, [:company] => :environment do |t, args|
  	Rails.logger.info "Rake Task: feed_items:clean_missing_user_feed_items to #{args[:company]} started"
  	
  	company = Company.find args[:company]
  	company.users.each do |user|
  		user.user_feed_items.each do |user_feed_item|
  			Rails.logger.info "#{user_feed_item.feed_items.exists?}"
  			user_feed_item.destroy unless user_feed_item.feed_items.exists?
  		end
  	end
  	
  	Rails.logger.info "Rake Task: feed_items:clean_missing_user_feed_items to #{args[:company]} complete"

  end

end
