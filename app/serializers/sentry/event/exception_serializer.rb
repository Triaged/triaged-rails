class Sentry::Event::ExceptionSerializer < ActiveModel::Serializer
	attributes :provider, :event, :id, :project, :message, :culprit, :logger, :level

	def provider
		"sentry"
	end

	def event
		"exception"
	end
end