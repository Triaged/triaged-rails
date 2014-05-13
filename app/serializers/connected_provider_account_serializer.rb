class ConnectedProviderAccountSerializer < ApplicationSerializer
  attributes :id, :external_id, :name, :url, :default, :account_label, :property_label

  #has_many :provider_properties, serializer: ProviderPropertySerializer

  def property_label
  	object.property_label.pluralize
  end
end
