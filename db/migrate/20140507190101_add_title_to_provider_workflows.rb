class AddTitleToProviderWorkflows < ActiveRecord::Migration
  def change
    add_column :provider_workflows, :title, :text
  end
end
