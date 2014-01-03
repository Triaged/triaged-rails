class Bitbucket::Repo < ProviderProperty
  include Mongoid::Document

  field :full_name, type: String
  field :html_url, type: String
  field :url, type: String
  field :issues_url, type: String
  field :owner, type: String

end
