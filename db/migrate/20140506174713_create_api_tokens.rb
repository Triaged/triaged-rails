class CreateApiTokens < ActiveRecord::Migration
  def change
    create_table :api_tokens do |t|
      t.string :slug
      t.references :tokenable, index: true, polymorphic: true

      t.timestamps
    end
  end
end
