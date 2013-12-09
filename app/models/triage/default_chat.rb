class Triage::DefaultChat < FeedItem
  include Mongoid::Document

  field :title, :type => String
  field :body, :type => String
  
  def self.default_item company

  	default_chat = Triage::DefaultChat.new(
  		timestamp: DateTime.now,
  		html_url: "https://www.triaged.co/support",
  		external_id: "#{company.id}-1",
  		title: "Get your team involved",
  		body: "It's really easy to collaborate with teammates on Triage, helping you diagnose and resolve issues as fast as possible."
  	)

  	user = User.find_by email: "team@triaged.co"

  	default_chat.messages << Messages::Message.new(
  		uuid: "1",
  		timestamp: DateTime.now - 3.seconds,
  		author: user,
  		body: "Protip: Use the @ sign to mention specific users."
  	)
  	default_chat.messages << Messages::Message.new(
  		uuid: "2",
  		timestamp: DateTime.now - 2.seconds,
  		author: user,
  		body: "Double Secret Protip: Add @triage to any message and we'll get notified instantly. We'd love to hear from you."
  	)

  	default_chat.messages << Messages::Message.new(
			uuid: "3",
  		author: user,
  		timestamp: DateTime.now,
  		body: "Swipe from the right to see your teammates."
  	)
		

  	return default_chat
  end
end
