class Bitbucket::Event::CommitSerializer < ActiveModel::Serializer
  attributes :id, :author, :branch, :timestamp, :message, :url
end
