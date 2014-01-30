class Github::Event::PullRequest < BaseServiceEvent
  
  def self.build_from_webhook data, company
    event = {
      type: :event,
      company_id: company.id.to_s,
      provider_name: self.provider_name, event_name: self.event_name,
      title: data.pull_request.title,
      account_name: data.repository.owner.login,
      push_notify: false,
      external_id: data.number,
      property_name: data.repository.name,
      description: data.pull_request.body,
      footer: nil,
      timestamp: DateTime.now,
      url: data.pull_request.html_url,
    }

    event[:author] = {
      username: data.pull_request.user.login
    }
    return event.to_json
  end
end
