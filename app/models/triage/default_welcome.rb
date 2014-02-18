class Triage::DefaultWelcome < FeedItem

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

  	user = User.find_by email: "team@triaged.co"
  	default_welcome.messages << Messages::Message.new(
  		uuid: "6",
  		timestamp: DateTime.now,
  		author: user,
  		body: "Swipe from the left to connect your accounts."
  	)

  	return default_welcome
  end
end
