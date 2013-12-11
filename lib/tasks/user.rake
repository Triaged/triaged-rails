namespace :user do
  desc "TODO"
  

  task :delete, [:email] => :environment do |t, args|
  	Rails.logger.info "Rake Task: user:delete to #{args[:email]} started"
  	
  	user = User.find_by email: args[:email]
  	company = user.company

  	if company.users.count == 1
  		Rails.logger.info "1 user company, deleting company"
  		company.feed_items.destroy
  		company.provider_credentials.destroy
  		company.provider_accounts.destroy
  	end

  	user.provider_credentials.destroy
  	user.destroy

		Rails.logger.info "Rake Task: user:delete to #{args[:email]} complete"
  end

end
