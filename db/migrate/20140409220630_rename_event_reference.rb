class RenameEventReference < ActiveRecord::Migration
  def change
  	remove_reference :feed_items, :event, index: true
  	add_reference :feed_items, :event_type, index: true
  end
end
