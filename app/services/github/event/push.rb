class Github::Event::Push < BaseServiceEvent
  

  def self.build_from_webhook data, company
    return nil if data.deleted == true

    org_name = data.repository.respond_to?(:organization) ? data.repository.organization : data.repository.owner.name
    branch = data.ref.split("/").last

    event = {
      company_id: company.id.to_s,
      provider: {name: self.provider_name }, 
      event_name: self.event_name,
      account_name: org_name,
      property_name: data.repository.name,
      external_id: data.head_long,
      title: "Pushed to #{branch}",
      footer: branch,
      url: data.url,
      push_notify: false,
      group_event: false,

    }

    event[:author] = { 
      name: data.pusher.name,
      email: data.pusher.email 
    }

    event[:body_list] = []
    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event[:body_list] << commit.message
      event[:timestamp] = commit.timestamp
      event[:external_id] = commit.id
    end

    return event.to_json
  end

end
