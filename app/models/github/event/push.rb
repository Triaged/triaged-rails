class Github::Event::Push < FeedItem
  include Mongoid::Document

  field :pusher, :type => String
  field :branch, :type => String
  field :repo_id, :type => Integer

  belongs_to :org, :class_name => "Github::Org"
  embeds_many :commits, :class_name => "Github::Event::Commit"

  def repo
  	org.repos.find(repo_id)
  end

  
  def self.build_from_webhook event
  	org = Github::Org.find_by name: event.repository.organization
  	repo = org.repos.find_by name: event.repository.name

  	Rails.logger.info event.head_commit.inspect

  	push = Github::Event::Push.new(
  		pusher: event.pusher.name,
  		branch: event.ref.split("/").last,
  		external_id: event.head_commit.id,
  		org: org,
  		repo_id: repo.id
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

end
