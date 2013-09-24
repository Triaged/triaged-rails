class Github::Event::PushSerializer < ActiveModel::Serializer
	attributes :provider, :event, :id, :pusher, :branch

	def provider
		"github"
	end

	def event
		"push"
	end
end