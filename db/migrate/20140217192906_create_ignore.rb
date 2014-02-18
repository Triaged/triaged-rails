class CreateIgnore < ActiveRecord::Migration
  def change
    create_table :ignores do |t|
      t.string :ff_type
      t.integer :ff_id
    end
  end
end
