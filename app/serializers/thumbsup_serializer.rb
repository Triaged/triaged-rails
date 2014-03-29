class ThumbsupSerializer < ApplicationSerializer
  attributes :id
  has_one :user
end
