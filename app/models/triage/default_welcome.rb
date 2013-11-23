class Triage::DefaultWelcome < FeedItem
  include Mongoid::Document

  field :title, :type => String
  field :body, :type => String
  
  def self.default_item company

  	default_welcome = Triage::DefaultWelcome.new(
  		timestamp: DateTime.now,
  		html_url: "https://www.triaged.co/support",
  		external_id: "#{company.id}-3",
  		title: "Welcome to Triage",
  		body: "We're super excited to have you onboard!\n\nOnce you connect a few services, you'll start seeing activity here. We can't wait."
  	)

  	return default_welcome
  end
end
