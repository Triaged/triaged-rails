class Heroku::Event::Deploy < BaseServiceEvent

  def self.build_from_webhook data, company
    event = {
      company_id: company.id.to_s,
      provider_name: self.provider_name, 
      event_name: self.event_name,
      account_name: nil,
      property_name: data.app,
      external_id: data.head_long,
      title: "Deployed #{data.app}",
      footer: nil,
      url: data.url,
      thumbnail_url: "http://triage-staging.s3.amazonaws.com/assets/test-image-6f8dedfe4ecf4b196798c761067d64ed.png",
      image_url: "http://res.cloudinary.com/triage/image/upload/v1391194497/xpsrtmtfkrhquw12xmau.png",
      timestamp: nil,
      push_notify: true,
      group_event: false
    }

    event[:author] = { 
      email: data.user, 
    }

    event[:body_list] = []
    data.git_log.split("\n ").each do |commit|
      event[:body_list] << commit.gsub("*", "").strip
    end

    return event.to_json
  end
  
end
