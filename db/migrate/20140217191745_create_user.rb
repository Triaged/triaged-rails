class CreateUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.boolean :push_enabled
      t.boolean :validated_belongs_to_company
      t.string :company_validation_token
      t.boolean :personal
    end
  end
end
