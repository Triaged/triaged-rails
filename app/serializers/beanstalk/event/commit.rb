class Beanstalk::Event::CommitSerializer < ActiveModel::Serializer
  attributes :id, :author, :author_email, :timestamp, :message, :url
end
