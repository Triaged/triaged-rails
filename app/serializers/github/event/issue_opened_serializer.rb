class Github::Event::IssueOpenedSerializer < ActiveModel::Serializer
	attributes  :provider, :event, :id, :title, :opened_by_name, :assigned_to_name, :body, :html_url

	def provider
	  	"github"
	  end

	  def event
	  	"issue_opened"
	  end
end