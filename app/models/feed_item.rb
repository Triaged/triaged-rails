class FeedItem
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :company
  belongs_to :provider
  embeds_many :messages, class_name: "Messages::Message", order: "id DESC"
  embeds_many :shares

  
  field :external_id, type: String
  field :timestamp, type: DateTime
  field :html_url, :type => String

  #validates_uniqueness_of :external_id
	validates :external_id, :uniqueness => { :scope => [:company, :provider] }

	before_create :before_create
	after_save :after_save

	#
	# Lifecycle hooks
	#
	def after_build_hook company
		# placehold to be overridden in subclasses
	end

	def before_create
		self.provider = provider_from_name
		build_html_url
	end

	def after_save
		update_follower_feeds
	end


	def build_html_url
		# placehold to be overridden in subclasses
	end

	#
	# Feed Items
	#


	#
	# Allows us to setup custom objects that a user can ignore
	#
	def ignorable_objects
		[]
	end

	
	
	def update_follower_feeds
		follower_feed_items.each {|item| item.update_attribute(:updated_at, self.updated_at)}
	end

	def follower_feed_items
		company.followers_of(self.provider).collect {|follower| follower.user_feed_items.where(feed_item_id: self.id).entries }.flatten
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

	def provider_from_name
		Provider.find_by name: provider_name
	end

	def provider_name
		self.class.name.split("::").first.underscore
	end

	def event_name
		self.class.name.split("::").last.underscore
	end

	def human_event_name
		event_name.humanize
	end

end
