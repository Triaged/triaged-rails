class Github::Event::IssueOpenedSerializer < FeedItemSerializer
	attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url
end