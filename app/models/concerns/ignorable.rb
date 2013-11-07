module Ignorable
	extend ActiveSupport::Concern

	included do |base|
		base.has_many :ignored_objects, :class_name => 'Ignore', :inverse_of => :nil,  :dependent => :destroy
		#base.has_and_belongs_to_many :ignored_providers, :inverse_of => :nil, :class_name => 'Provider'
	end

	def ignore(model)
		if !self.ignores?(model)
    	return false unless model.before_ignored(self) if model.respond_to?('before_ignored')
     	return false unless self.before_ignore(model) if self.respond_to?('before_ignore')
       
      self.ignored_objects << model
      self.after_ignore(model) if self.respond_to?('after_ignore')

      return true
    else
      return false
    end
  end

  def stop_ignoring(model)
		if self.ignores?(model)
    	#return false unless model.before_unfollowed(self) if model.respond_to?('before_unfollowed')
     	#return false unless self.before_unfollow(model) if self.respond_to?('before_unfollow')
       
      self.ignored_objects.delete(model)
      #self.after_unfollow(model) if self.respond_to?('after_unfollow')

      return true
    else
      return false
    end
  end


	# def can_follow_provider? provider
	# 	#credentials = credentials_for_provider provider
	# 	#credentials ? true : false
	# 	true # Can always follow a provider, for now... later, we might enfore individual oAuth
	# end

	# know if self is already following model
  #
  # Example:
  # => @bonnie.follows?(@clyde)
  # => true
  def ignores?(model)
    0 < self.ignored_objects.where(id: model.id).limit(1).count
  end

  def ignored_provider_count
  	self.ignored_objects.count
  end

end