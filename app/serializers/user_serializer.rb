class UserSerializer < ApplicationSerializer
  attributes :id, :name, :email, :avatar_url #, :slug

  def avatar_url
  	object.avatar.face.url
  end
end
