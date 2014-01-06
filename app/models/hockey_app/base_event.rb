class HockeyApp::BaseEvent < Cards::Event
  include Mongoid::Document

  field :title, :type => String
  
end
