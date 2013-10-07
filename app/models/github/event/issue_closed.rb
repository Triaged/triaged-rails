class Github::Event::IssueClosed < FeedItem
  include Mongoid::Document

  field :title, type: String
  field :closed_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String

  belongs_to :issue, class_name: "Github::Issue"


  def self.build_from_webhook event
  	repo = Github::Repo.find_by name: event.repository.name
		issue = repo.issues.find_by external_id: event.issue.id

  	issue.update_attributes(
  		open: false,
  		closed_by_name: event.issue.user.login
  		)
  	

		issue_closed_event = self.build_event_from_issue issue
		return issue_closed_event
  end

  def self.build_event_from_issue issue
  	issue_closed_event = Github::Event::IssueClosed.new(
  		title: issue.title,
  		closed_by_name: issue.closed_by_name,
  		assigned_to_name: issue.assigned_to_name,
  		body: issue.body,
  		html_url: issue.html_url,
  		issue: issue
  		)
  	return issue_closed_event
  end


end
