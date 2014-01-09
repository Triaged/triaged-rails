class Beanstalk::Event::Push < BaseServiceEvent
	
  def self.build_from_webhook data, company

    event_set = {
      type: :event_set,
      company_id: company.id,
      provider_name: self.provider_name,
      title: "Pushed to #{data.branch}",
      timestamp: DateTime.now,
      should_push: false
    }

    event_set[:events] = []
    data.commits.each do |commit|
      commit = RecursiveOpenStruct.new(commit)
      event_set[:events] << {
        external_id: commit.id,
        property_name: data.repository.name,
        description: commit.message,
        footer: data.branch,
        timestamp: commit.timestamp,
        url: commit.url,
      }
    end

    event_set[:author] = { 
      name: data.commits.last[:author][:name], 
      email: data.commits.last[:author][:email] 
    }
    
    return event_set.to_json
  end


end