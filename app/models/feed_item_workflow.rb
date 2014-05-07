class FeedItemWorkflow < ActiveRecord::Base
  belongs_to :feed_item
  belongs_to :provider_workflow
end
