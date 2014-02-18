class Ignore < ActiveRecord::Base

  belongs_to :ignorer, :polymorphic => true
  #belongs_to :ignoree, :polymorphic => true
end