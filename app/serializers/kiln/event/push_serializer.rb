class Kiln::Event::PushSerializer < FeedItemSerializer
	attributes :repo_name, :pusher, :repo_url, :branch
	has_many :commits
end