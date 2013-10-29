class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo.name.capitalize
	end

	def action
		"#{object.pusher.underscore.humanize} pushed #{object.commits.count} commits to #{object.branch}"
	end

	def body
		 object.commits.collect {|commit| commit.message.capitalize }.join("\n")
	end

end