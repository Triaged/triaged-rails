# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Provider.create(name: "stripe", webhooks_enabled: false) # This is odd, because stripe does use a webhook, but because of setup, we turn off.
Provider.create(name: "github", webhooks_enabled: true)
Provider.create(name: "google_analytics", webhooks_enabled: false)
Provider.create(name: "new_relic", webhooks_enabled: true)
Provider.create(name: "heroku", webhooks_enabled: true)
#Provider.create(name: "pager_duty")
#Provider.create(name: "shopify")
Provider.create(name: "sentry", webhooks_enabled: true)
Provider.create(name: "airbrake", webhooks_enabled: true)
Provider.create(name: "kiln", webhooks_enabled: true)
Provider.create(name: "hockey_app", webhooks_enabled: true)
