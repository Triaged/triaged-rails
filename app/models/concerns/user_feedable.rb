module UserFeedable
	extend ActiveSupport::Concern

	included do 
		embeds_many :user_feed_items
		#index({ "user_feed_items.feed_item_id" => 1 }, { unique: true, drop_dups: true })
	end

	def feed(min_updated_at = nil, max_updated_at = nil)
		feed_items = user_feed_items.only(:feed_item_id).desc(:feed_item_id)
		feed_items = feed_items.gt(updated_at: (Time.parse(min_updated_at) + 1)) if min_updated_at  #where(:updated_at.gt => min_updated_at) if min_updated_at
  	#feed_items = feed_items.where(:updated_at.lt => max_updated_at) if max_updated_at
  	feed_items = feed_items.limit(100) unless min_updated_at

  	FeedItem.desc(:created_at).find(feed_items.collect {|item| item.feed_item_id })
  	#company.feed_items.desc(:created_at).find(feed_items.collect {|item| item.feed_item_id })
  end

  def add_event_to_feed event
  	logger.info "Adding event to user feed"
  	unless ignore_event(event)
			user_feed_items.create(feed_item: event)
	  	#Common::NotificationService.push_feed_item(self, event) if should_push?(event)
	  	logger.info "Added #{event.provider_name}:#{event.event_name} to user feed: #{email}"
	  else
	  	logger.info "Ignoring event #{event.provider_name}:#{event.event_name} to user feed: #{email}"
	  end
  end

  def should_push? event
  	event.push_notify || user_feed_items.count == 3
  end


  # allows custom objects to be defined on the event, which the user can ignore.
  # An example is specific repos for a github event, or a profile for a Google Analytics event
  def ignore_event event
		event.ignorable_objects.each do |object|
  		return true if self.ignores? object
  	end
  	return false
	end

end