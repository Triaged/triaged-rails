class Beanstalk::Event::PushSerializer < EventSerializer
	attributes :repo_name, :repo_url, :branch
	has_many :commits
end