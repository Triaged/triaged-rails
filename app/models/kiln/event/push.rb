class Kiln::Event::Push < FeedItem 
	include Mongoid::Document

  field :repo_name, :type => String
  field :repo_url, :type => String
  field :pusher, :type => String
  field :branch, :type => String
  

  embeds_many :commits, :class_name => "Kiln::Event::Commit"

  
  def self.build_from_webhook event
  	push = Kiln::Event::Push.new(
  		pusher: event.pusher.fullName,
  		repo_name: event.repository.name,
  		repo_url: event.repository.url,
  		timestamp: DateTime.now
  	)
  	
  	event.commits.each do |commit|
			commit = commit.to_properties
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
  	push.html_url = push.commits.repo_url

  	return push
  end

end