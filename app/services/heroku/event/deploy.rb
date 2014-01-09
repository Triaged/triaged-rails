class Heroku::Event::Deploy < BaseServiceEvent

  def self.build_from_webhook data, company
    event_set = {
      type: :event_set,
      company_id: company.id,
      provider_name: self.provider_name,
      title: "Deployed #{data.app}",
      timestamp: DateTime.now,
      should_push: false
    }

    event_set[:events] = []
    data.git_log.split("\n ").each do |commit|
      event_set[:events] << {
        external_id: "h-#{data.head_long}",
        description: commit.gsub("*", "").strip,
        timestamp: DateTime.now,
        url: data.url,
      }
    end

    event_set[:author] = { 
      email: data.user, 
    }
    
    Rails.logger.info event_set.inspect

    return event_set.to_json
  end
  
end
