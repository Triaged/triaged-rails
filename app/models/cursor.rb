class Cursor < ActiveRecord::Base

  field :current, :type => String
  
  belongs_to :company
  belongs_to :provider

	#validates_uniqueness_of [:provider, :company]

end
