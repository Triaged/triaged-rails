class AddCompanyToConnectedProviderProperties < ActiveRecord::Migration
  def change
    add_reference :connected_provider_properties, :company, index: true
  end
end
