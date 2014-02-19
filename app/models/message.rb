class Message < ActiveRecord::Base
	acts_as_superclass

  belongs_to :feed_item
  belongs_to :author, class_name: "User"

	validates_uniqueness_of :uuid

  after_create :set_author_name

  def set_author_name
  	author_name = author.name if author
  end


end
