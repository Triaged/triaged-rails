class Github::Event::PushSerializer < ActiveModel::Serializer
	attributes :provider, :event, :id, :pusher, :branch

	has_many :commits

	def provider
		"github"
	end

	def event
		"push"
	end
end