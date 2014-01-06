class Heroku::Event::Deploy < Cards::Event
  include Mongoid::Document

  def self.build_from_webhook data, company

  	Rails.logger.info "building heroku deploy"

  	event = Heroku::Event::Deploy.new(
			external_id: "h-#{data.head_long}",
			property_name: data.app,
			title: "Deploy by #{data.user}",
			body: data.error.error_message,
			html_url: data.url,
		)

		data.git_log.split("\n ").each do |commit|
			event.line_items.build(
        text: commit.gsub("*", "").strip,
      )
		end

  	#user: data.user,

  	Rails.logger.info event.inspect

		return event
	end

end
