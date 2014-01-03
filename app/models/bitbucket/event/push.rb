class Bitbucket::Event::Push < Bitbucket::BaseEvent
  include Mongoid::Document

  field :repo_name, :type => String
  field :repo_url, :type => String
  field :pusher, :type => String
  field :branch, :type => String
  
  

  embeds_many :commits, :class_name => "Bitbucket::Event::Commit"

  
  def self.build_from_webhook event
    push = Bitbucket::Event::Push.new(
      pusher: event.user,
      repo_name: event.repository.name,
      repo_url: "https://bitbucket.org#{event.repository.absolute_url}"
    )
    
    event.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      push.commits.build(
        external_id: commit.node,
        author: commit.author,
        branch: commit.branch,
        timestamp: commit.timestamp,
        message: commit.message,
        url: commit.url,
        )
    end

    push.external_id = push.commits.first.external_id
    push.branch =   push.commits.first.branch
    push.html_url = push.repo_url

    return push
  end


end
