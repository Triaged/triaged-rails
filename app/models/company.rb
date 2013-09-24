class Company
  include Mongoid::Document
  include Mongoid::Slug

  field :name, :type => String
  

  embeds_many :feed_items

  has_many :users
  has_many :provider_credentials
  has_many :github_repos, :class_name => "Github::Repo"

  def add_event_to_feed event
  	feed_items << event
  	event
  end

  def push_event_to_followers event
  	provider = event.provider
  	Rails.logger.info "Provider: #{provider.name}"
  	followers_of(provider).each { |follower| follower.add_event_to_feed event }
	end

	def followers_of provider
		followers = users.select { |user| user.follows? provider }
	end

	slug do |object|
    object.name.split(".").first.to_url
  end

end
