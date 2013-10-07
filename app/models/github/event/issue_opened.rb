class Github::Event::IssueOpened < FeedItem
  include Mongoid::Document

	field :title, type: String
	field :open, type: Boolean, default: true
  field :opened_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String
  field :repo_id, :type => Integer

  belongs_to :org, :class_name => "Github::Org"

   def repo
  	org.repos.find(repo_id)
  end

  def self.build_from_webhook event
  	org = Github::Org.find_by name: event.repository.owner.login
  	repo = org.repos.find_by name: event.repository.name

  	assigned_to_name = (event.issue.assignee != nil) ? event.issue.assignee.login : nil
  	open = event.issue.state == "open" ? true : false

  	issue_opened_event = Github::Event::IssueOpened.new(
  		title: event.issue.title,
  		opened_by_name: event.issue.user.login,
  		assigned_to_name: assigned_to_name,
  		body: event.issue.body,
  		open: open,
  		html_url: event.issue.html_url,
  		external_id: event.issue.id,
  		org: org,
  		repo_id: repo.id,
  		timestamp: DateTime.now
  		)
  	return issue_opened_event
	end
end
