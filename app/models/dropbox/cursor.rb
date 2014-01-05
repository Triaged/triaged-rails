class Dropbox::Cursor
  include Mongoid::Document
  include Mongoid::Timestamps

  field :current, :type => String
  
  embedded_in :company



end
