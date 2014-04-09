class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|

    	t.string :name
    	t.references :feed_item
    	
      t.timestamps
    end
  end
end
