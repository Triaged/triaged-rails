class Cursor < ActiveRecord::Base

  belongs_to :company
  belongs_to :provider

	#validates_uniqueness_of [:provider, :company]

end
