class Github::Event::IssueOpenedSerializer < EventSerializer
	attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url
end