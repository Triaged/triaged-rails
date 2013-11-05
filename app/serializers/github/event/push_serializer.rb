class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo.name.capitalize
	end

	def action
		"#{object.pusher.underscore.humanize} pushed to #{object.branch}"
	end

	def body
		body = object.commits.take(5).collect {|commit| "\u2022 #{commit.message.capitalize}" }.join("\n")
		body += "\nand #{object.commits.count - 5} more" if object.commits.count > 5
		return body
	end

	def commits_formatter commits
		body = commits.take(5).collect {|commit| commit.message.capitalize }.join("\n")
		body += "\nAnd #{commits.count - 5} more" if commits.count > 5
	end

end