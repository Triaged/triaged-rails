class Github::Event::IssueClosed < FeedItem
  
   def self.build_from_webhook data, company
    assigned_to_name = data.issue.respond_to?(:assignee) && data.issue.assignee ?  data.issue.assignee.login : nil
    org_name = data.repository.respond_to?(:owner) ? data.repository.owner.login : data.user.login
    open = data.issue.state == "open" ? true : false


    event = {
      type: :event,
      company_id: company.id.to_s,
      provider_name: self.provider_name, event_name: self.event_name,
      title: data.issue.title,
      account_name: org_name,
      push_notify: false,
      external_id: data.number,
      property_name: data.repository.name,
      description: data.issue.body,
      timestamp: DateTime.now,
      url: data.issue.html_url,
    }

    event[:footer] = "Assigned to #{assigned_to_name}" if assigned_to_name

    event[:author] = {
      username: data.pull_request.user.login
    }
    return event.to_json
  end
 
end
