class Company
  include Mongoid::Document
  include Mongoid::Slug
  include Providable

  field :name, :type => String
  

  embeds_many :feed_items
  embeds_many :connected_providers

  has_many :users
  
  has_many :provider_credentials

  has_many :github_organizations, :class_name => "Github::Org"
  

  def add_event_to_feed event
  	feed_items << event
  	Rails.logger.info "added #{event.inspect}"
		# This will fail if duplicate item exists in company feed
  	push_event_to_followers event if  event.persisted?
  	event
  end

  def push_event_to_followers event
  	provider = event.provider
  	followers_of(provider).each { |follower| follower.add_event_to_feed event }
  	Rails.logger.info "Pushed #{provider.name} event to followers"
	end

	def followers_of provider
		followers = users.select { |user| user.follows? provider }
	end

	def provider_connected? provider
		[connected_providers.collect { |connected| connected.provider }].flatten.include? provider
	end

	def connect_provider provider
		connected_providers.create provider: provider
	end

	def teammates_of user
		users.not_in(:id => user.id)
	end

	def default_github_org
		github_organizations.where(default: true).first
	end

	slug do |object|
    object.name.split(".").first.to_url
  end

  

end
