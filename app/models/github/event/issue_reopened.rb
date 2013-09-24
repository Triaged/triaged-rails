class Github::Event::IssueReopened < FeedItem
  include Mongoid::Document

  field :title, type: String
  field :opened_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String
  field :html_url, type: String

  belongs_to :issue, class_name: "Github::Issue"


  def self.build_from_webhook event
  	repo = Github::Repo.find_by name: event.repository.name
		issue = repo.issues.find_by external_id: event.issue.id

  	issue.update_attributes(
  		open: true,
  		opened_by_name: event.issue.user.login
  		)
  	
		issue_reopened_event = self.build_event_from_issue issue
		return issue_reopened_event
  end

  def self.build_event_from_issue issue
  	issue_reopened_event = Github::Event::IssueReopened.new(
  		title: issue.title,
  		opened_by_name: issue.opened_by_name,
  		assigned_to_name: issue.assigned_to_name,
  		body: issue.body,
  		html_url: issue.html_url,
  		issue: issue
  		)
  	return issue_reopened_event
  end
end
