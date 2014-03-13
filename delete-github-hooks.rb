ids = []

repos.each do |repo|
	hooks = github.repos.hooks.list("thefactory", repo).to_a
	hooks = hooks.flatten
	hooks.each do |hook|
	ids << [repo, hook.id, hook.config.url] if (hook.config && hook.config.url && hook.config.url == "https://www.triaged.co/github/1G9A4Q")
	end
end

ids.each do |o|
	github.repos.hooks.delete "thefactory", o[0], o[1]
end