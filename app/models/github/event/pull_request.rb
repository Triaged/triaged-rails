class Github::Event::PullRequest < Github::BaseEvent
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
  		org_name: event.repository.owner.login,
  		repo_name: event.repository.name,
  	)
  	return issue_opened_event
	end

  def should_push?
    true
  end
end
