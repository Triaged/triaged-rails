module CompanyFeedable
	extend ActiveSupport::Concern

	included do 
		embeds_many :feed_items
		index "feed_items.id" => 1
	end

	def add_event_to_feed event
  	feed_items << event
  	Rails.logger.info "added #{event.inspect}"
		# This will fail if duplicate item exists in company feed
  	push_event_to_followers event if  event.persisted?
  	event
  end

  def push_event_to_followers event
  	provider = event.provider
  	# Push event to all employees
  	followers_of(provider).each { |follower| follower.add_event_to_feed event }
  	Rails.logger.info "Pushed #{provider.name} event to followers"
	end

end