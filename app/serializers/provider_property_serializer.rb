class ProviderPropertySerializer < ActiveModel::Serializer
  attributes :id, :name, :external_id, :follows

  def follows
  	!current_user.ignores? object
  end

  def name
  	object.name.pluralize
  end
end
