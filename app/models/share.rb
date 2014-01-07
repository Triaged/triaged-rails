class Share
  include Mongoid::Document

  belongs_to :feed_item
  belongs_to :user
  
  field :recipient_email, :type => String
  field :viewed, :type => Boolean

  

end
