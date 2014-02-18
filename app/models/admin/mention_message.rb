class Admin::MentionMessage < ActiveRecord::Base

  belongs_to :feed_item

  after_create :notify_admin

  def notify_admin
  	
  end


end
