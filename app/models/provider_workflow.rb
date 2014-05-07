class ProviderWorkflow < ActiveRecord::Base
	enum workflow_type: [ :app, :content ]
	
	belongs_to :provider

  validates :name, :uniqueness => {:scope => :provider_id}

  scope :app_workflows, -> { where("workflow_type <> ?", ProviderWorkflow.statuses[:app]) }
  scope :content_workflows, -> { where("workflow_type <> ?", ProviderWorkflow.statuses[:content]) }

end