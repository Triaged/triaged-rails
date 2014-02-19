class CreatePushToken < ActiveRecord::Migration
  def change
    create_table :push_tokens do |t|
      t.references :user
      t.string :service
      t.string :token
      t.string :count
    end
  end
end
