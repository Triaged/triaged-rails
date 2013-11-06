class Company
  include Mongoid::Document
  include Mongoid::Slug
  include Providable
  include Serviceable
  include CompanyFeedable

  field :name, :type => String
  field :personal, :type => Boolean, :default => false
  
	has_many :users
	embeds_many :connected_providers

	index({ "feed_item.external_id" => 1 })
  index({ "feed_item.updated_at" => 1 })

  def followers_of provider
		users.select { |user| !user.ignores? provider }
	end

	def teammates_of user
		users.not_in(:id => user.id)
	end

	def connect_provider provider
		connected_providers.create provider: provider
	end

	def provider_connected? provider
		[connected_providers.collect { |connected| connected.provider }].flatten.include? provider
	end

	slug do |object|
    object.name.split(".").first.to_url
  end


  def self.create_placeholder_company
		Company.create name: unique_slug, personal: true
  end

private 

  def unique_slug
    # not doing uppercase as url is case insensitive
    charset = Tokenizer.key_chars
    (0...Tokenizer.unique_key_length).map{ charset[rand(charset.size)] }.join
  end

end
