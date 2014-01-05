class Dropbox::Event::Update < FeedItem 
	include Mongoid::Document

	embeds_many :files, :class_name => "Dropbox::Event::File"

	def self.build_from_webhook event
  	push = Dropbox::Event::Update.new(
  		pusher: event.pusher.fullName,
  		repo_name: event.repository.name,
  		repo_url: event.repository.url
  	)
  	
  	event.commits.each do |commit|
			commit = RecursiveOpenStruct.new(commit)
			push.commits.build(
  			external_id: commit.id,
  			author: commit.author,
  			branch: commit.branch,
  			timestamp: commit.timestamp,
  			message: commit.message,
  			url: commit.url,
  			)
  	end

  	push.external_id = push.commits.first.external_id
  	push.branch = 	push.commits.first.branch
  	push.html_url = push.repo_url

  	return push
  end

end