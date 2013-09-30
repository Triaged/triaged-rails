ActiveSupport::Notifications.subscribe "github.provider.created" do |name, start, finish, id, payload|
  Github::CreateHooksService.new(payload[:user_id]).create!
end

ActiveSupport::Notifications.subscribe "github.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::Push, payload)
end

ActiveSupport::Notifications.subscribe "github.issues" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueOpened, payload) if payload[:event][:event_action] == "opened"
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueReopened, payload) if payload[:event][:event_action] == "reopened"
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueClosed, payload) if payload[:event][:event_action] == "closed"
end

ActiveSupport::Notifications.subscribe "github.issue_comment" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::IssueComment, payload)
end

ActiveSupport::Notifications.subscribe "github.pull_request" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::PullRequest, payload)
end

ActiveSupport::Notifications.subscribe "github.commit_comment" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Github::Event::CommitComment, payload)
end