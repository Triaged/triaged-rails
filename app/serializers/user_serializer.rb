class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url

  def avatar_url
  	object.avatar.face.url
  end

  def mention_name
  	object.name.delete(' ')
  end

end
