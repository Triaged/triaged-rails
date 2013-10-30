namespace :push do
  desc "TODO"
  

  task :test, [:email, :alert] => :environment do |t, args|
  	Rails.logger.info "Rake Task: push:test to #{args[:email]} started"
  	
  	user = User.find_by email: args[:email]
		Common::NotificationService.push_test user, args[:alert]
  	
  	Rails.logger.info "Rake Task: push:test to #{args[:email]} complete"
  end

end
