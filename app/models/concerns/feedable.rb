module Feedable
	extend ActiveSupport::Concern

	included do 
		embeds_many :user_feed_items
	end

	def feed(min_id = nil, max_id = nil)
  	feed_items = user_feed_items.only(:id) 

  	# Filter on min or max
  	feed_items.gt(id: min_id) if min_id
  	feed_items.lt(id: max_id) if max_id

  	company.feed_items.desc(:created_at).find(feed_items.collect {|item| item.id })
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