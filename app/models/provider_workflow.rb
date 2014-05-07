class ProviderWorkflow < ActiveRecord::Base
	extend FriendlyId

	enum workflow_type: [ :app, :content ]
	friendly_id :name, use: [:slugged, :finders]

  belongs_to :provider

  validates :name, :uniqueness => {:scope => :provider_id}

  scope :app_workflows, -> { where("workflow_type <> ?", ProviderWorkflow.statuses[:app]) }
  scope :content_workflows, -> { where("workflow_type <> ?", ProviderWorkflow.statuses[:content]) }


end
