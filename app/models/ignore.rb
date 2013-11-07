class Ignore
  include Mongoid::Document

  field :ff_type
  field :ff_id

  belongs_to :ignorer, :polymorphic => true
  belongs_to :ignoree, :polymorphic => true
end