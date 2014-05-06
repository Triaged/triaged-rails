class CompanyAppSerializer < ApplicationSerializer
  attributes :id, :name, :app_type, :follows

  def follows
  	!current_user.ignores? object
  end

end
