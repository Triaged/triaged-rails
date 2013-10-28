class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo.name
	end

	def action
		"#{object.pusher} pushed to #{object.branch}"
	end

	def body
		"commits" #object.commits.select {|commit| commit.message }
	end

end