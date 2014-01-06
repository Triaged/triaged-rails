class Sentry::Event::Exception < FeedItem
  include Mongoid::Document

  
	def self.build_from_webhook data
		# event = Sentry::Event::Exception.new(
		# 	external_id: data.id,
		# 	project: data.project,
		# 	message: data.message,
		# 	culprit: data.culprit,
		# 	logger: data.logger,
		# 	level: data.level,
		# 	html_url: data.url
		# )

		event = Sentry::Event::Exception.new(
			external_id: data.id,
			property_name: data.project,
			title: "#{data.level.capitalize} Exception",
			body: data.message.truncate(320),
			footer: "as #{data.culprit}"
		)
	end

	def should_push?
		true
	end
end