class StatusReport < ActiveRecord::Base
	include Workflow

  belongs_to :user
  has_many :status_entries

  workflow do
  	state :unpublished do
  		event :publish, :transitions_to => :published
  	end
  	state :published
  end
end
