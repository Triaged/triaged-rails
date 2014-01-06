class Beanstalk::Event::Push < Cards::Event
	include Mongoid::Document

  field :repo_name, :type => String
  field :repo_url, :type => String
  field :branch, type: String
  

  embeds_many :commits, :class_name => "Beanstalk::Event::Commit"

  
  def self.build_from_webhook data, company
    event = Beanstalk::Event::Push.new(
      external_id: data.after,
      property_name: data.repository.name,
      title:  "Pushed to #{object.branch}",
    )

  	data.commits.each do |commit|
			commit = RecursiveOpenStruct.new(commit)
			event.line_items.build(
        text: commit.message,
        url: commit.url,
        timestamp: commit.timestamp,
      )
      #author: commit.author.name,
      #author_email: commit.author.email,
  	end

  	return event
  end


end