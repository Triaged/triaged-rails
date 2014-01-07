class Github::Event::Push < Github::BaseEvent
  include Mongoid::Document

  def self.build_from_webhook data, company
  	return nil if data.deleted == true

  	org_name = data.repository.respond_to?(:organization) ? data.repository.organization : data.repository.owner.name

  	# push = Github::Event::Push.new(
  	# 	pusher: event.pusher.name,
  	# 	branch: event.ref.split("/").last,
  	# 	external_id: event.head_commit.id,
  	# 	html_url: event.head_commit.url,
  	# 	org_name: org_name,
  	# 	repo_name: event.repository.name,
  	# )
  	
  	# event.commits.each do |commit|
   #    commit = RecursiveOpenStruct.new(commit)
   #    author = commit.author.respond_to?(:username) ? commit.author.username : commit.author.name

			# push.commits.build(
  	# 		external_id: commit.id,
  	# 		author: author,
  	# 		author_email: commit.author.email,
  	# 		timestamp: commit.timestamp,
  	# 		message: commit.message,
  	# 		url: commit.url,
  	# 		)
  	# end

    branch = data.ref.split("/").last


    event = Github::Event::Push.new(
      external_id: data.head_commit.id,
      property_name: data.repository.name,
      title: "#{data.pusher.name.underscore.humanize.titleize} pushed to #{branch}",
      html_url: data.head_commit.url,
    )

    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event.line_items.build(
        text: commit.message,
        url: commit.url,
        timestamp: commit.timestamp,
      )
    end

  	return event
  end

  def should_push?
		false
	end


end
