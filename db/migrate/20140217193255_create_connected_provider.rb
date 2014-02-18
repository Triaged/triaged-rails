class CreateConnectedProvider < ActiveRecord::Migration
  def change
    create_table :connected_providers do |t|
      t.reference :company
      t.reference :provider
    end
  end
end
