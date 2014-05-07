class AppWorkflow < ActiveRecord::Base
  belongs_to :company_app
  belongs_to :provider_workflow
end
