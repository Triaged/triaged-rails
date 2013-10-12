class Heroku::Event::Deploy < FeedItem
  include Mongoid::Document

  field :app, :type => String
  field :user, :type => String
  field :git_log, :type => String
  field :head_long, :type => String
  field :head, :type => String
  field :prev_head => String

  def self.build_from_webhook data
		event = Heroku::Event::Deploy.new(
			external_id: data.head_long,
			app: data.app,
			user: data.user,
			html_url: data.url,
			git_log: data.git_log,
			head_long: data.head_long,
			head: data.head,
			prev_head: data.prev_head,
			timestamp: DateTime.now
		)
	end

end
