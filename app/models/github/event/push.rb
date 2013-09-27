class Github::Event::Push < FeedItem
  include Mongoid::Document

  field :pusher, :type => String
  field :branch, :type => String

  belongs_to :repo, :class_name => "Github::Repo"
  embeds_many :commits, :class_name => "Github::Event::Commit"

  
  def self.build_from_webhook event
  	Rails.logger.info "------------"
  	org = Github::Org.find_by name: event.repository.organization
  	repo = org.repos.find_by name: event.repository.name

  	push = Github::Event::Push.new(
  		pusher: event.pusher.name,
  		branch: event.ref.split("/").last,
  		external_id: event.head_commit.id,
  		repo: repo
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
