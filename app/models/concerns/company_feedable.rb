module CompanyFeedable
	extend ActiveSupport::Concern

	included do 
		#embeds_many :feed_items
		#index "feed_items.id" => 1
		has_many :feed_items
	end

	def add_event_to_feed event
  	Rails.logger.info "adding #{event.inspect}"
    feed_items << event
  	puts "added #{event.inspect}"
  	puts event.errors.inspect
		# This will fail if duplicate item exists in company feed
  	# push_event_to_followers event if  event.persisted?
    push_event_to_apps event if  event.persisted?
  	event
  end

  def push_event_to_apps event
    accounts = ProviderAccount.where(company: self, provider: event.provider)
    
    accounts.each do |account|
      properties = account.provider_properties.where(name: event.property_name)
      properties.each do |property|
        account.company_app.add_event_to_feed(event) if property.connected?
      end
    end
  end

  def push_event_to_followers event
  	provider = event.provider
  	Rails.logger.info provider.name
  	# Push event to all employees
  	followers_of(provider).each do |follower| 
  		Rails.logger.info "Adding to #{follower.email} user feed"
  		follower.add_event_to_feed event
  	end
  end

end