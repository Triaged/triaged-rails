class AddProviderToEvents < ActiveRecord::Migration
  def change
  	remove_reference :events, :feed_item, index: true
  	add_reference :events, :provider, index: true
  end
end
