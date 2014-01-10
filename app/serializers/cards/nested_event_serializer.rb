class Cards::NestedEventSerializer < ActiveModel::Serializer
  attributes :id, :property_name, :description, :footer, :timestamp, :url, :thumbnail_url, :icon
end
