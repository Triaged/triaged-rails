class Github::Event::Push < Github::BaseEvent
  include Mongoid::Document

  field :pusher, :type => String
  field :branch, :type => String
  
  embeds_many :commits, :class_name => "Github::Event::Commit"

  def self.build_from_webhook event
  	return nil if event.deleted == true

  	org_name = event.repository.respond_to?(:organization) ? event.repository.organization : event.repository.owner.name

  	push = Github::Event::Push.new(
  		pusher: event.pusher.name,
  		branch: event.ref.split("/").last,
  		external_id: event.head_commit.id,
  		html_url: event.head_commit.url,
  		org_name: org_name,
  		repo_name: event.repository.name,
  		timestamp: DateTime.now
  	)
  	
  	event.commits.each do |commit|

  		Rails.logger.info commit.inspect

  		author = commit.author.respond_to?(:username) ? commit.author.username : commit.author.name

			commit = commit.to_properties
			push.commits.build(
  			external_id: commit.id,
  			author: author,
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
