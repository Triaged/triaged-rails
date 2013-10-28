class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo.name.capitalize
	end

	def action
		"#{object.pusher.humanize} pushed to #{object.branch}"
	end

	def body
		 object.commits.collect {|commit| commit.message }.join("\n")
	end

end