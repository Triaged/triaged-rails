class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url #, :slug

  def avatar_url
  	object.avatar.face.url
  end
end
