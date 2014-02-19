class DropFfTypeAndFfIdFromIgnore < ActiveRecord::Migration
  def change

  	remove_column :ignores, :ff_type
  	remove_column :ignores, :ff_id
  end
end
