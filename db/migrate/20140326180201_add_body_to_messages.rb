class AddBodyToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :body, :string
    add_column :messages, :user_mentions, :string, array: true, default: []
  end
end
