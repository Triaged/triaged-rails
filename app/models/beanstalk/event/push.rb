class Beanstalk::Event::Push < FeedItem
	include Mongoid::Document

  field :repo_name, :type => String
  field :repo_url, :type => String
  field :branch, type: String
  

  embeds_many :commits, :class_name => "Beanstalk::Event::Commit"

  
  def self.build_from_webhook event
  	push = Beanstalk::Event::Push.new(
  		repo_name: event.repository.name,
  		repo_url: event.repository.url,
  		external_id: event.after
  	)
  	
  	event.commits.each do |commit|
			commit = commit.to_properties
			push.commits.build(
  			external_id: commit.id,
  			author: commit.author.name,
  			author_email: commit.author.email,
  			timestamp: commit.timestamp,
  			message: commit.message,
  			url: commit.url,
  			)
  	end

  	return push
  end


end