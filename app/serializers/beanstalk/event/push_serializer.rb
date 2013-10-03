class Beanstalk::Event::PushSerializer < FeedItemSerializer
	attributes :repo_name, :repo_url, :branch
	has_many :commits
end