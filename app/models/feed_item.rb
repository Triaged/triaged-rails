class FeedItem < ActiveRecord::Base

  belongs_to :company
  belongs_to :author, class_name: "User", inverse_of: :authored_feed_items
  belongs_to :provider
	belongs_to :provider_account
	belongs_to :provider_property
	belongs_to :user_feed_item
	belongs_to :event_type
	
	has_many :messages#, order: "id DESC"
  has_many :shares
  has_many :thumbsups
  has_many :feed_item_workflows

	validates :provider, presence: true
	validates :title, presence: true
	validates :external_id, presence: true

	mount_uploader :event_image, ItemImageUploader

  after_save :after_save

	#
	# Lifecycle hooks
	#
	def after_build_hook company
		
		# Set timestamp if we don't already have one
		self.timestamp = DateTime.now unless self.timestamp

		# Set Provider name
		self.provider_name = self.provider.name

		# condense body list if only one entry exists
		if !self.body_list.nil? && self.body_list.count == 1
			self.body = self.body_list.first
			self.body_list = nil
		end

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, self.provider)
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
