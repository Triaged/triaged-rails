class Kiln::Event::PushSerializer < TextItemSerializer
	#attributes :repo_name, :pusher, :repo_url, :branch
	#has_many :commits

	def property
		object.repo_name.capitalize
	end

	def action
		"#{object.pusher.humanize} pushed to #{object.branch}"
	end

	def body
		object.commits.collect {|commit| commit.message }.join("\n")
	end
end