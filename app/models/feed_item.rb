class FeedItem
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :company
  belongs_to :user
  embeds_many :messages, order: "id DESC"
  has_many :shares

  
  field :timestamp, type: DateTime
  field :should_push, type: Boolean, default: true
  

  index({ "updated_at" => 1 })
 	index({ author_id: 1 })
 	
	after_save :after_save

	#
	# Lifecycle hooks
	#
	def after_build_hook company
		# placehold to be overridden in subclasses
	end

	

	def after_save
		update_follower_feeds
	end

	def assign_author email, name=''
		
	end

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


end
