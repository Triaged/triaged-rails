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


  def self.create_placeholder_company name
  	Company.create name: name, personal: true
  end

end
