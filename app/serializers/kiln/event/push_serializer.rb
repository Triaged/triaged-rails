class Kiln::Event::PushSerializer < TextItemSerializer
	#attributes :repo_name, :pusher, :repo_url, :branch
	#has_many :commits

	def property
		object.repo_name.capitalize
	end

	def action
		"#{object.pusher.underscore.humanize} pushed to #{object.branch}"
	end

	def body
		body = object.commits.take(5).collect {|commit| "- #{commit.message.capitalize}" }.join("\n")
		body += "\nand #{object.commits.count - 5} more" if object.commits.count > 5
		return body
	end

	def commits_formatter commits
		body = commits.take(5).collect {|commit| "- #{commit.message.capitalize}" }.join("\n")
		body += "\nand #{commits.count - 5} more" if commits.count > 5
		return body
	end
end