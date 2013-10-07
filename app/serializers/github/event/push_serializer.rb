class Github::Event::PushSerializer < FeedItemSerializer
	attributes :pusher, :branch#, :repo_name
	has_many :commits
	#has_one :repo

	# def repo_name
	# 	object.repo.name
	# end
end