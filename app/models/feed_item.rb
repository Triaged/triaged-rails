class FeedItem
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :company
  embeds_many :messages, class_name: "Messages::Message", order: "id DESC"

  field :external_id, type: String
  field :timestamp, type: DateTime
  field :html_url, :type => String

  index({ external_id: 1 }, { unique: true, background: true })
  index({ updated_at: 1})
	#validates_uniqueness_of :external_id

	before_create :before_create
	after_save :after_save

	#
	# Lifecycle hooks
	#
	def after_build_hook company
		# placehold to be overridden in subclasses
	end

	def before_create
		build_html_url
	end

	def after_save
		update_follower_feeds
	end


	def build_html_url
		# placehold to be overridden in subclasses
	end

	
	def update_follower_feeds
		follower_feed_items.each {|item| item.update_attribute(:updated_at, self.updated_at)}
	end

	def follower_feed_items
		followers.collect {|follower| follower.user_feed_items.where(feed_item_id: self.id).entries }.flatten
	end

	def followers
		company.users.select {|user| user.follows? provider }
	end

	#
	# Push Messaging
	#

	def should_push?
		false
	end

	def push_message
		"This should really be set by a subclass"
	end

	#
	# Subclass naming
	#

	def provider
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.underscore
	end

	def event_name
		self.class.name.split("::").last.underscore
	end


end
