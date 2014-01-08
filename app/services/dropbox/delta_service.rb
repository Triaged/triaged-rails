class Dropbox::DeltaService < Dropbox::BaseService

	def fetch_delta(should_save=true)
		puts "Old Cursor: #{ @company.dropbox_cursor.current}"

		result = @dropbox_client.delta(@company.dropbox_cursor.current)

		puts "New Cursor: #{ result['cursor']}"

		@company.dropbox_cursor.update_attributes(current: result['cursor'])

		if should_save

			item = Dropbox::Event::Update.new(
				external_id: @company.dropbox_cursor.current,
				timestamp: DateTime.now
			)

			for path, metadata in result['entries']
				#puts path
				status =  (metadata != nil) ? :updated : :deleted
				item.line_items.build(
					text: "#{path} #{status}",
					thumbnail_url: metadata['thumb_exists'],
					mime_type: metadata['mime_type'],
					icon: metadata['icon'],
					timestamp: metadata['modified']
				)
			end

			Common::FeedService.add_to_feed item, @company
		end
	end

end