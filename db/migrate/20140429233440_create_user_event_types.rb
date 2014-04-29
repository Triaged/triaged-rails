class CreateUserEventTypes < ActiveRecord::Migration
  def change
    create_table :user_event_types do |t|
      t.references :user, index: true
      t.references :event_type, index: true
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
