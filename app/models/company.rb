class Company < ActiveRecord::Base
  include Providable
  include Serviceable
  include CompanyFeedable
  include Cursable

  
  has_one :api_token, as: :tokenable
  has_many :users
	has_many :connected_providers
	has_many :company_apps

	# index({ "feed_item.external_id" => 1 }, { unique: true, drop_dups: true })
 #  index({ "feed_item.updated_at" => 1 })

  before_create :set_company_token
  

  

  def followers_of provider
		users.select do |user| 
			!user.ignores? provider 
		end
	end

	def teammates_of user
		users.where.not(id: user.id).where(validated_belongs_to_company: true)
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
		self.api_token = ApiToken.create!
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
