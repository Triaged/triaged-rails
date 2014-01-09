class Bitbucket::Event::Push < BaseServiceEvent
  
  def self.build_from_webhook data, company
    event_set = {
      type: :event_set,
      company_id: company.id,
      provider_name: provider_name,
      title: "Pushed to #{data.branch}",
      timestamp: DateTime.now,
      should_push: => false
    }

    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event_set[:events] << {
        external_id: commit.node,
        property_name: data.repository.name,
        description: commit.message,
        footer: commit.branch,
        timestamp: commit.timestamp,
        url: commit.url,
      }
    end

    event_set[:author] = { 
      username: data.user, 
    }
    
    return event_set.to_json
  end


end
