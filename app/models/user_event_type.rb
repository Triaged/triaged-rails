class UserEventType < ActiveRecord::Base
	belongs_to :user
  belongs_to :event_type

  enum status: { follow: 0, mute: 1, notification: 2 }

end
