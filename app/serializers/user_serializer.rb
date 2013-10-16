class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar_url

  def avatar_url
  	object.avatar_url
  end
end
