class AddProviderSectionToProviders < ActiveRecord::Migration
  def change
    add_reference :providers, :provider_section, index: true
  end
end
