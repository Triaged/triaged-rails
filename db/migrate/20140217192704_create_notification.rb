class CreateNotification < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.reference :user
      t.string :body
      t.boolean :viewed, default: false
    end
  end
end
