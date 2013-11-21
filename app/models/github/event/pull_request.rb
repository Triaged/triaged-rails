class Github::Event::PullRequest < FeedItem
  include Mongoid::Document

  field :action, type: String
	field :opened_by_name, type: String
  field :title, type: String
  field :body, type: String
  
  def self.build_from_webhook event
  	issue_opened_event = Github::Event::PullRequest.new(
  		action: event.action,
  		opened_by_name: event.pull_request.user.login,
  		title: event.pull_request.title,
  		body: event.pull_request.body,
  		html_url: event.pull_request.html_url,
  		external_id: "#{event.action}-#{event.number}",
  		org_name: event.repo.owner.login,
  		repo_name: event.repo.name,
  		timestamp: DateTime.now
  		)
  	return issue_opened_event
	end
end
