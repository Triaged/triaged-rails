class Github::Event::IssueClosed < FeedItem
  include Mongoid::Document

  field :title, type: String
	field :open, type: Boolean, default: true
  field :opened_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String
  
  def self.build_from_webhook event
  	assigned_to_name = event.issue.respond_to?(:assignee) ? event.issue.assignee.login : nil
  	open = event.issue.state == "open" ? true : false

  	issue_closed_event = Github::Event::IssueClosed.new(
  		title: event.issue.title,
  		opened_by_name: event.issue.user.login,
  		assigned_to_name: assigned_to_name,
  		body: event.issue.body,
  		open: open,
  		html_url: event.issue.html_url,
  		external_id: event.issue.id,
  		org_name: event.repository.owner.login,
  		repo_name: event.repository.name
  	)
  	return issue_closed_event
	end
end
