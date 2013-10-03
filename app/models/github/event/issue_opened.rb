class Github::Event::IssueOpened < FeedItem
  include Mongoid::Document

	field :title, type: String
  field :opened_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String

  belongs_to :issue, class_name: "Github::Issue"

  def self.build_from_webhook event
  	issue = Github::Issue.create_issue_from_webhook event
		issue_opened_event = self.build_event_from_issue issue
		return issue_opened_event
  end

  def self.build_event_from_issue issue
  	issue_opened_event = Github::Event::IssueOpened.new(
  		title: issue.title,
  		opened_by_name: issue.opened_by_name,
  		assigned_to_name: issue.assigned_to_name,
  		body: issue.body,
  		html_url: issue.html_url,
  		issue: issue
  		)
  	return issue_opened_event
  end
end
