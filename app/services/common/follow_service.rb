module Common::FollowService

	def self.create(user, provider)
		if user.can_follow_provider? provider
			user.follow provider
			return true
		else
			return false
		end
	end

end