class Bitbucket::Event::CommitSerializer < ApplicationSerializer
  attributes :id, :author, :branch, :timestamp, :message, :url
end
