class Provider
	include Rails.application.routes.url_helpers
  include Mongoid::Document
  

  field :name, :type => String

  validates :name, uniqueness: true
  
  def self.named name
  	Provider.where(name: name).first
  end

  def service_url_for_company company
  	service_url = "services_#{name}_index_url"
  	send(service_url, :subdomain => company.slug)
  end
 
end
