class Cards::NestedEventSerializer < ActiveModel::Serializer
  
  attributes :id, :external_id, :property_name, :description, :footer, :timestamp, :url, :thumbnail_url, :icon
end
