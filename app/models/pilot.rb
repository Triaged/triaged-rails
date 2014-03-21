class Pilot
  include Mongoid::Document
  field :name, type: String
  field :email, type: String
  field :company, type: String
  field :teamsize, type: Integer
  field :team, type: String
  field :saas_other, type: String
  field :team_other, type: String
  field :saas, type: Array
  field :os, type: String
end
