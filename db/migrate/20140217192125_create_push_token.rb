class CreatePushToken < ActiveRecord::Migration
  def change
    create_table :push_tokens do |t|
      t.reference :user
      t.string :service
      t.string :token
      t.string :count
    end
  end
end
