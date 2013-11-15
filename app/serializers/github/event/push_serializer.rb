class Github::Event::PushSerializer < TextItemSerializer
	#attributes :pusher, :branch, :repo_name
	#has_many :commits
	#has_one :repo

	
	def property
		object.repo_name.capitalize
	end

	def action
		"#{object.pusher.underscore.humanize.titleize} pushed to #{object.branch}"
	end

	def body
		body = object.commits.take(5).collect {|commit| "- #{commit.message.capitalize}" }.join("\n")
		body += "\n\nand #{object.commits.count - 5} more" if object.commits.count > 5
		return body
	end
end