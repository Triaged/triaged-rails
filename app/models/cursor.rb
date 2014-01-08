class Cursor
  include Mongoid::Document
  include Mongoid::Timestamps

  field :current, :type => String
  
  embedded_in :company
  belongs_to :provider


  validates_uniqueness_of :provider

end
