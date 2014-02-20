class Dropbox::Event::Update < BaseServiceEvent
  
  def self.build_from_delta path, metadata, company
    #puts path
    status =  (metadata != nil) ? :updated : :deleted

    access_token = company.dropbox_provider_credentials.access_token
    image_url = (metadata && metadata['thumb_exists']) ? "https://api-content.dropbox.com/1/thumbnails/dropbox#{path}?size=xl&access_token=#{access_token}" : nil

    event = {
      company_id: company.id.to_s,
      provider: {name: self.provider_name }, 
      event_name: self.event_name,
      account_name: nil,
      property_name: nil,
      external_id: metadata['rev'],
      title: "Files Uploaded",
      body: "#{path} #{status}",
      image_url: image_url,
      footer: nil,
      url: nil,
      timestamp: metadata['modified'],
      push_notify: false,
      group_event: false,

    }
    return event.to_json
  end


end




