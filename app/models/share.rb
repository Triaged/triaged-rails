class Share
  include Mongoid::Document

  embedded_in :feed_item
  
  field :recipient_email, :type => String
  field :viewed, :type => Boolean

  belongs_to :user

end
