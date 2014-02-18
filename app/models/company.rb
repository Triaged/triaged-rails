class Company < ActiveRecord::Base
  include Providable
  include Serviceable
  include CompanyFeedable
  include Cursable

  field :name, :type => String
  field :api_token, :type => String
  
	has_many :users
	has_many :connected_providers

	# index({ "feed_item.external_id" => 1 }, { unique: true, drop_dups: true })
 #  index({ "feed_item.updated_at" => 1 })

  before_create :set_company_token
  

  slug do |object|
    Tokenizer.unique_token(6)
  end

  def followers_of provider
		users.select do |user| 
			!user.ignores? provider 
		end
	end

	def teammates_of user
		users.not_in(:id => user.id).where(validated_belongs_to_company: true)
	end

	def connect_provider provider
		connected_providers.create provider: provider
	end

	def provider_connected? provider
		[connected_providers.collect { |connected| connected.provider }].flatten.include? provider
	end

	def personal?
		users.first.personal
	end

	def set_company_token
		self.api_token = self.slug
  end

  def add_default_feed_items
  # 	add_event_to_feed Triage::DefaultChat.default_item(self)
		# add_event_to_feed Triage::DefaultGraph.default_item(self)
		# add_event_to_feed Triage::DefaultWelcome.default_item(self)
  end

  def self.create_placeholder_company
		Company.create name: Tokenizer.unique_token
  end

end
