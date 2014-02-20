class Cards::LineItemSerializer < ApplicationSerializer
  attributes :id, :timestamp, :text, :url, :thumbnail_url
end
