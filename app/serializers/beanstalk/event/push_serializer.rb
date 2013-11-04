class Beanstalk::Event::PushSerializer < TextItemSerializer
	# attributes :repo_name, :repo_url, :branch
	# has_many :commits

	def property
		object.repo_name.capitalize
	end

	def action
		"Pushed to #{object.branch}"
	end

	def body
		commits_formatter(object.commits)
	end

	def commits_formatter commits
		body = commits.take(5).collect {|commit| commit.message.capitalize }.join("\n")
		body += "\nAnd #{commits.count - 5} more" if commits.count > 5
	end
end