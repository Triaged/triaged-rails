class Kiln::Event::Push < FeedItem 
	include Mongoid::Document

  def self.build_from_webhook data, company
     event = Kiln::Event::Push.new(
      external_id: data.after,
      property_name: event.repository.name,
      title: "#{event.pusher.fullName.humanize} pushed",
    )

    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event.line_items.build(
        text: commit.message,
        url: commit.url,
        timestamp: commit.timestamp,
      )
    end




  	# push = Kiln::Event::Push.new(
  	# 	pusher: event.pusher.fullName,
  	# 	repo_name: event.repository.name,
  	# 	repo_url: event.repository.url
  	# )
  	
  	# event.commits.each do |commit|
			# commit = RecursiveOpenStruct.new(commit)
			# push.commits.build(
  	# 		external_id: commit.id,
  	# 		author: commit.author,
  	# 		branch: commit.branch,
  	# 		timestamp: commit.timestamp,
  	# 		message: commit.message,
  	# 		url: commit.url,
  	# 		)
  	# end

  	# push.external_id = push.commits.first.external_id
  	# push.branch = 	push.commits.first.branch
  	# push.html_url = push.repo_url

  	return event
  end

end