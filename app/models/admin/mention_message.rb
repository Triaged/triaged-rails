class Admin::MentionMessage
  include Mongoid::Document

  belongs_to :feed_item

  after_create :notify_admin

  def notify_admin
  	
  end


end
