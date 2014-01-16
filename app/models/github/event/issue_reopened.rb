class Github::Event::IssueReopened < Github::BaseEvent
  include Mongoid::Document

  field :title, type: String
	field :open, type: Boolean, default: true
  field :opened_by_name, type: String
  field :assigned_to_name, type: String
  field :body_text, type: String
  
  def self.build_from_webhook event
    assigned_to_name = event.issue.respond_to?(:assignee) && event.issue.assignee ?  event.issue.assignee.login : nil
    org_name = event.repository.respond_to?(:owner) ? event.repository.owner.login : event.user.login
    open = event.issue.state == "open" ? true : false

    issue_opened_event = Github::Event::IssueReopened.new(
      title: event.issue.title,
      opened_by_name: event.issue.user.login,
      assigned_to_name: assigned_to_name,
      body_text: event.issue.body,
      open: open,
      html_url: event.issue.html_url,
      external_id: event.number,
      org_name: org_name,
      repo_name: event.repository.name
    )
    return issue_opened_event
  end
end
