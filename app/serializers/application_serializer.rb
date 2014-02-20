class ApplicationSerializer < ApplicationSerializer

	def id
		object.id.to_s
	end
end