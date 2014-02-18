class CreateCompany < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.string :api_token
    end
  end
end
