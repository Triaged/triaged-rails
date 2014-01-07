class Github::Event::PullRequest < Github::BaseEvent
  include Mongoid::Document

  def self.build_from_webhook data, company
  	# issue_opened_event = Github::Event::PullRequest.new(
  	# 	action: event.action,
  	# 	opened_by_name: event.pull_request.user.login,
  	# 	title: event.pull_request.title,
  	# 	body: event.pull_request.body,
  	# 	html_url: event.pull_request.html_url,
  	# 	external_id: "#{event.action}-#{event.number}",
  	# 	org_name: event.repository.owner.login,
  	# 	repo_name: event.repository.name,
  	# )
  	# return issue_opened_event

    event = Github::Event::PullRequest.new(
      external_id: "#{event.action}-#{event.number}",
      property_name: data.repository.name,
      title: data.pull_request.title,
      body: data.pull_request.body,
      html_url: data.pull_request.html_url,
    )

	end
end
