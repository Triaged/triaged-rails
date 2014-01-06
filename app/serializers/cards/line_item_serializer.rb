class Cards::LineItemSerializer < ActiveModel::Serializer
  attributes :id, :timestamp, :text, :url, :thumbnail_url
end
