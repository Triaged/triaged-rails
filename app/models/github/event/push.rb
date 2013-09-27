class Github::Event::Push < FeedItem
  include Mongoid::Document

  field :pusher, :type => String
  field :branch, :type => String

  belongs_to :repo, :class_name => "Github::Repo"

  
  def commits
  	repo.commits.where(:push_id => self.id)
  end


  def self.build_from_webhook event
  	Rails.logger.info "------------"
  	push = Github::Event::Push.new(
  		pusher: event.pusher.name,
  		branch: event.ref.split("/").last,
  		external_id: event.head_commit.id
  		)
  	
  	org = Github::Org.find_by name: event.repository.organization
  	repo = org.repos.find_by name: event.repository.name
  	# Embed the commits into the repo, since the repo holds the state.
  	# Then, attach the commit to the push, to reference in the push event
		event.commits.each do |commit|
			commit = commit.to_properties
			repo.create(
  			external_id: commit.id,
  			author: commit.author.username,
  			author_email: commit.author.email,
  			timestamp: commit.timestamp,
  			message: commit.message,
  			url: commit.url,
  			push: push
  			)
  	end

  	push.repo = repo
  	return push
  end

end
