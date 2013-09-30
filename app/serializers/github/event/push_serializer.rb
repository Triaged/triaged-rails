class Github::Event::PushSerializer < EventSerializer
	attributes :pusher, :branch, :url
	has_many :commits

	def url
		object.repo.html_url
	end
end