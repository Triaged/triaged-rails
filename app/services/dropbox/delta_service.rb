class Dropbox::DeltaService < Dropbox::BaseService

	def fetch_delta(should_save=true)
		puts "Old Cursor: #{ @company.dropbox_cursor.current}"

		result = @dropbox_client.delta(@company.dropbox_cursor.current)

		puts result['entries'].count

		@company.dropbox_cursor.update_attributes(current: result['cursor'])

		puts "New Cursor: #{@company.dropbox_cursor.current}"

		if should_save && (result['entries'].count > 0)

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
		else # We're not saving
			# We need to iterate the cursor to the current position
			Dropbox::DeltaService.new(@company.id).fetch_delta(false) if result['has_more']
		end
	end

end