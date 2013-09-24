class Github::IssueComment
  include Mongoid::Document

  field :external_id, type: Integer
  field :html_url, type: String
  field :url, type: String

  embedded_in :issue, :class_name => "Github::Issue"	
end
