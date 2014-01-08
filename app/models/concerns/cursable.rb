module Cursable
	extend ActiveSupport::Concern

	included do 
		embeds_many :cursors
	end

	def dropbox_cursor
		cursors.where(provider: Provider.named("dropbox")).first
	end

end