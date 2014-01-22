# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Provider.create(name: "stripe", webhooks_enabled: false, title: "Stripe", short_title: "Stripe", oauth: true) # This is odd, because stripe does use a webhook, but because of setup, we turn off.
Provider.create(name: "github", webhooks_enabled: true, title: "GitHub", short_title: "GitHub", account_label: 'Organization', property_label: 'Repo', oauth: true)
Provider.create(name: "bitbucket", webhooks_enabled: true, title: "Bitbucket", short_title: "Bitbucket", account_label: 'Organization', property_label: 'Repo', oauth: true)
Provider.create(name: "google_analytics", webhooks_enabled: false, title: "Google Analytics", short_title: "Google", account_label: 'Account', property_label: 'Property', oauth: true)
Provider.create(name: "new_relic", webhooks_enabled: true, title: "New Relic", short_title: "New Relic")
Provider.create(name: "heroku", webhooks_enabled: true, title: "Heroku", short_title: "Heroku")
Provider.create(name: "sentry", webhooks_enabled: true, title: "Sentry", short_title: "Sentry")
Provider.create(name: "beanstalk", webhooks_enabled: true, title: "Beanstalk", short_title: "Beanstalk")
Provider.create(name: "airbrake", webhooks_enabled: true, title: "Airbrake", short_title: "Airbrake")
Provider.create(name: "kiln", webhooks_enabled: true, title: "Kiln", short_title: "Kiln")
Provider.create(name: "hockey_app", webhooks_enabled: true, title: "HockeyApp", short_title: "HockeyApp")
Provider.create(name: "crashlytics", webhooks_enabled: true, title: "Crashlytics", short_title: "Crashlytics")
Provider.create(name: "braintree", webhooks_enabled: true, title: "Braintree", short_title: "Braintree")
Provider.create(name: "triage", webhooks_enabled: false, title: "Triage", short_title: "Triage")
Provider.create(name: "dropbox", webhooks_enabled: false, title: "Dropbox", short_title: "Dropbox", oauth: true)
Provider.create(name: "trello", webhooks_enabled: false, title: "Trello", short_title: "Trello", oauth: true)
Provider.create(name: "appfigures", webhooks_enabled: false, title: "appFigures", short_title: "appFigures", account_label: 'Account', property_label: 'App', oauth: true)
Provider.create(name: "zapier", webhooks_enabled: true, title: "Zapier", short_title: "Zapier")