class CreateConnectedProvider < ActiveRecord::Migration
  def change
    create_table :connected_providers do |t|
      t.references :company
      t.references :provider
    end
  end
end
