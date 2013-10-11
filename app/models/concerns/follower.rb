module Follower
	extend ActiveSupport::Concern

	included do |base|
		base.has_and_belongs_to_many :followed_providers, :inverse_of => :nil, :class_name => 'Provider', :dependent => :destroy
	end

	def follow(model)
		if !self.follows?(model)
    	return false unless model.before_followed(self) if model.respond_to?('before_followed')
     	return false unless self.before_follow(model) if self.respond_to?('before_follow')
       
      self.followed_providers << model
      self.after_follow(model) if self.respond_to?('after_follow')

      return true
    else
      return false
    end
  end

  def unfollow(model)
		if self.follows?(model)
    	return false unless model.before_unfollowed(self) if model.respond_to?('before_unfollowed')
     	return false unless self.before_unfollow(model) if self.respond_to?('before_unfollow')
       
      self.followed_providers.delete(model)
      self.after_unfollow(model) if self.respond_to?('after_unfollow')

      return true
    else
      return false
    end
  end


	def can_follow_provider? provider
		#credentials = credentials_for_provider provider
		#credentials ? true : false
		true # Can always follow a provider, for now... later, we might enfore individual oAuth
	end

	# know if self is already following model
  #
  # Example:
  # => @bonnie.follows?(@clyde)
  # => true
  def follows?(model)
    0 < self.followed_providers.where(id: model.id).limit(1).count
  end

end