class Heroku::Event::DeploySerializer < FeedItemSerializer
	attributes :app, :user, :git_log, :head_long, :head, :previous_head
end