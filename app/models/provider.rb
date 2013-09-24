class Provider
  include Mongoid::Document
  

  field :name, :type => String

  
  def self.stripe
  	Provider.where(name: "stripe").first
  end

  def self.github
  	Provider.where(name: "github").first
  end

  def self.sentry
  	Provider.where(name: "sentry").first
  end

  def self.google_analytics
  	Provider.where(name: "google_analytics").first
  end

end
