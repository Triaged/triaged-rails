class Github::Event::PushSerializer < EventSerializer
	attributes :pusher, :branch
	has_many :commits
	#has_one :repo
end