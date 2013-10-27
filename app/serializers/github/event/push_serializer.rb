class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo.name
	end

	def body
		object.commits.select {|commit| commit.message }
	end

end