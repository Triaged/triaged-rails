module UserFeedable
	extend ActiveSupport::Concern

	included do 
		embeds_many :user_feed_items
		index "user_feed_items.feed_item_i" => 1
	end

	def feed(min_updated_at = nil, max_updated_at = nil)
		feed_items = user_feed_items.only(:feed_item_id)

  	feed_items = feed_items.where(:updated_at.gt => min_updated_at) if min_updated_at
  	feed_items = feed_items.where(:updated_at.lt => max_updated_at) if max_updated_at

  	company.feed_items.desc(:created_at).find(feed_items.collect {|item| item.feed_item_id })
  end

  def add_event_to_feed event
  	# Get user settings for this event
  	# settings = blah.blah
  	# Check if we settings are active
  	logger.info "adding user feed"
  	user_feed_items.create(feed_item: event)
  	Common::NotificationService.push_feed_item(self, event) if event.should_push?
  end

end