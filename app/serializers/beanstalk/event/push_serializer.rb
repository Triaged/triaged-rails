class Beanstalk::Event::PushSerializer < TextItemSerializer
	# attributes :repo_name, :repo_url, :branch
	# has_many :commits

	def property
		object.repo_name
	end

	def action
		"push to #{object.branch}"
	end

	def body
		object.commits.select {|commit| commit.message }
	end
end