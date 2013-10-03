class Github::Event::PushSerializer < FeedItemSerializer
	attributes :pusher, :branch
	has_many :commits
	#has_one :repo
end