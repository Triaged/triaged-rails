class Kiln::Event::PushSerializer < EventSerializer
	attributes :repo_name, :pusher, :repo_url
	has_many :commits
end