class RenameEventTable < ActiveRecord::Migration
  def change
  	rename_table :events, :event_types 
  end
end
