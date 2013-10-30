class Company
  include Mongoid::Document
  include Mongoid::Slug

  field :name, :type => String
  

  embeds_many :feed_items
  embeds_many :connected_providers

  has_many :users
  
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
  	# Push event to all employees
  	followers_of(provider).each { |follower| follower.add_event_to_feed event }
  	Rails.logger.info "Pushed #{provider.name} event to followers"
	end

	def followers_of provider
		followers = users.select { |user| !user.ignores? provider }
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

  # provider scopes
	def default_stripe_provider_credentials
  	users_provider_credentials.where(provider: Provider.named("stripe")).first
  end

  def default_github_provider_credentials
  	users_provider_credentials.where(provider: Provider.named("github")).first
  end

  def default_google_analytics_provider_credentials
  	users_provider_credentials.where(provider: Provider.named("google_analytics")).first
  end

	def users_provider_credentials
		ProviderCredential.where(:user.in => users)
	end  

end
