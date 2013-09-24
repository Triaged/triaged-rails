class Github::Issue
  include Mongoid::Document

  field :external_id, type: Integer
  field :open, type: Boolean, default: true
	field :title, type: String
  field :opened_by_name, type: String
  field :closed_by_name, type: String
  field :assigned_to_name, type: String
  field :body, type: String
  field :url, type: String
  field :html_url, type: String


  embedded_in :repo	
  embeds_many :comments, :class_name => "Github::IssueComment"

  belongs_to :company
  

  def feed_items
  	company.feed_items.where(issue_id: self.id)
  end

  def self.create_issue_from_webhook event
  	repo = Github::Repo.find_by name: event.repository.name
  	
  	assigned_to_name = (event.issue.assignee != nil) ? event.issue.assignee.login : nil
  	open = event.issue.state == "open" ? true : false

  	issue = Github::Issue.create(
  		external_id: event.issue.id,
  		title: event.issue.title,
  		body: event.issue.body,
  		opened_by_name: event.issue.user.login,
  		assigned_to_name: assigned_to_name,
  		url: event.issue.url,
  		html_url: event.issue.html_url,
  		open: open,
  		repo: repo,
  		company: repo.company
  		)

  	return issue
  end
end
