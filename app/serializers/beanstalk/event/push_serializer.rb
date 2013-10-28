class Beanstalk::Event::PushSerializer < TextItemSerializer
	# attributes :repo_name, :repo_url, :branch
	# has_many :commits

	def property
		object.repo_name.capitalize
	end

	def action
		"Push to #{object.branch}"
	end

	def body
		object.commits.collect {|commit| commit.message }.join("\n")
	end
end