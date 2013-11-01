class HockeyApp::BaseEvent < FeedItem
  include Mongoid::Document

  field :title, :type => String
  
end
