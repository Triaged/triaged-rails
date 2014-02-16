class Dropbox::DeltaService < Dropbox::BaseService

	def fetch_delta(should_save=true)
		puts "Old Cursor: #{ @company.dropbox_cursor.current}"

		result = @dropbox_client.delta(@company.dropbox_cursor.current)

		puts result['entries'].count

		@company.dropbox_cursor.update_attributes(current: result['cursor'])

		puts "New Cursor: #{@company.dropbox_cursor.current}"

		if should_save && (result['entries'].count > 0)
			event_set =  Dropbox::Event::Update.build_from_delta result
			Common::FeedService.add_to_feed event_set, @company
		else # We're not saving
			# We need to iterate the cursor to the current position
			Dropbox::DeltaService.new(@company.id).fetch_delta(false) if result['has_more']
		end
	end

end