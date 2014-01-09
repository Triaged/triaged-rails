class Github::Event::Push < BaseServiceEvent
  

  def self.build_from_webhook data, company
    return nil if data.deleted == true

    org_name = data.repository.respond_to?(:organization) ? data.repository.organization : data.repository.owner.name

    event_set = {
      type: :event_set,
      company_id: company.id.to_s,
      provider_name: org_name,
      title: "Pushed",
      timestamp: DateTime.now,
      should_push: false
    }

    branch = data.ref.split("/").last

    event_set[:events] = []
    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event_set[:events] << {
        external_id: commit.node,
        property_name: data.repository.name,
        description: commit.message,
        footer: branch,
        timestamp: commit.timestamp,
        url: commit.url,
      }
    end

    event_set[:author] = { 
      name: data.pusher.name,
      email: data.pusher.email 
    }
    
    return event_set.to_json
  end

end
