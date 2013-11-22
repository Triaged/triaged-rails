class Github::Event::Push < Github::BaseEvent
  include Mongoid::Document

  field :pusher, :type => String
  field :branch, :type => String
  
  embeds_many :commits, :class_name => "Github::Event::Commit"

  def self.build_from_webhook event
  	push = Github::Event::Push.new(
  		pusher: event.pusher.name,
  		branch: event.ref.split("/").last,
  		external_id: event.head_commit.id,
  		html_url: event.head_commit.url,
  		org_name: event.repository.organization || event.repository.owner.login,
  		repo_name: event.repository.name,
  		timestamp: DateTime.now
  	)
  	
  	event.commits.each do |commit|
			commit = commit.to_properties
			push.commits.build(
  			external_id: commit.id,
  			author: commit.author.username,
  			author_email: commit.author.email,
  			timestamp: commit.timestamp,
  			message: commit.message,
  			url: commit.url,
  			)
  	end

  	return push
  end

  def should_push?
		false
	end

	def push_message
		"#{pusher} pushed to #{repo_name}"
	end


end
