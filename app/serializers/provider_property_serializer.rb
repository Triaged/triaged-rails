class ProviderPropertySerializer < ActiveModel::Serializer
  attributes :id, :name, :external_id, :follows
end
