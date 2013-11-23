class Heroku::Event::Deploy < FeedItem
  include Mongoid::Document

  field :app, :type => String
  field :user, :type => String
  field :git_log, :type => Array
  field :head_long, :type => String
  field :previous_head, :type => String
  field :head, :type => String


  def self.build_from_webhook data
		event = Heroku::Event::Deploy.new(
			external_id: "h-#{data.head_long}",
			app: data.app,
			user: data.user,
			html_url: data.url,
			git_log: data.git_log.split("\n ").collect{ |git| git.gsub("*", "").strip},
			head_long: data.head_long,
			head: data.head
		)

		event.previous_head = data.prev_head if data.prev_head

		return event
	end

end
