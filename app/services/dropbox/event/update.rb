class Dropbox::Event::Update < BaseServiceEvent
	
	def self.build_from_delta result

		event_set = {
      type: :event_set,
      company_id: company.id,
      provider_name: provider_name,
      title: "Files Uploaded",
      timestamp: DateTime.now,
      should_push: => false
    }

    for path, metadata in result['entries']
			#puts path
			status =  (metadata != nil) ? :updated : :deleted
      event_set[:events] << {
        external_id: metadata['rev'],
        property_name: data.repository.name,
        description: "#{path} #{status}",
        footer: commit.branch,
        timestamp: metadata['modified'],
        url: commit.url,
        thumbnail_url: metadata['thumb_exists'],
      }
    end

    return event_set.to_json
	end


end




