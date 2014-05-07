class CreateAppWorkflows < ActiveRecord::Migration
  def change
    create_table :app_workflows do |t|
      t.references :company_app, index: true
      t.references :provider_workflow, index: true

      t.timestamps
    end
  end
end
