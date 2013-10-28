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
		object.commits.collect {|commit| commit.message.capitalize }.join("\n")
	end
end