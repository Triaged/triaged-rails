class Github::Event::IssueOpened < Github::BaseEvent
  include Mongoid::Document

	
  
  def self.build_from_webhook data, company
  	assigned_to_name = event.issue.respond_to?(:assignee) && event.issue.assignee ?  event.issue.assignee.login : nil
		org_name = event.repository.respond_to?(:owner) ? event.repository.owner.login : event.user.login
		open = event.issue.state == "open" ? true : false

  	# issue_opened_event = Github::Event::IssueOpened.new(
  	# 	title: event.issue.title,
  	# 	opened_by_name: event.issue.user.login,
  	# 	assigned_to_name: assigned_to_name,
  	# 	body_text: event.issue.body,
  	# 	open: open,
  	# 	html_url: event.issue.html_url,
  	# 	external_id: event.number,
  	# 	org_name: org_name,
  	# 	repo_name: event.repository.name
  	# )
  	event = Github::Event::IssueOpened.new(
      external_id: "#{event.action}-#{event.number}",
      property_name: data.repository.name,
      title: data.issue.title,
      body: data.issue.body,
      html_url: data.issue.html_url,
    )
	end

	def should_push?
		true
	end
end
