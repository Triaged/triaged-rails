module Feedable
	extend ActiveSupport::Concern

	included do 
		embeds_many :user_feed_items
	end

	def feed
  	feed_item_ids = user_feed_items.collect {|user_item| user_item.feed_item_id }
  	company.feed_items.find feed_item_ids
  end

  def add_event_to_feed event
  	# Get user settings for this event
  	# settings = blah.blah
  	# Check if we settings are active
  	logger.info "adding user feed"
  	user_feed_items.create(feed_item: event)
  	# NotificationService.push event if user.settings.should_push_notification
  end

end