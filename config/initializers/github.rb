ActiveSupport::Notifications.subscribe "provider_credentials.created.github" do |name, start, finish, id, payload|
  Github::CreateHooksService.new(payload[:company_id]).create!
end

ActiveSupport::Notifications.subscribe "event.github.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::Push, payload)
end

ActiveSupport::Notifications.subscribe "event.github.issues" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueOpened, payload) if payload[:event]["action"] == "opened"
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueReopened, payload) if payload[:event]["action"] == "reopened"
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueClosed, payload) if payload[:event]["action"] == "closed"
end

ActiveSupport::Notifications.subscribe "event.github.issue_comment" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueComment, payload)
end

ActiveSupport::Notifications.subscribe "event.github.pull_request" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::PullRequest, payload)
end

ActiveSupport::Notifications.subscribe "event.github.commit_comment" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::CommitComment, payload)
end