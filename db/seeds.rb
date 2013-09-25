# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Provider.create(name: "stripe")
Provider.create(name: "github")
Provider.create(name: "google-analytics")
Provider.create(name: "new-relic")
Provider.create(name: "heroku")
Provider.create(name: "pager-duty")
Provider.create(name: "shopify")
Provider.create(name: "sentry")
Provider.create(name: "airbrake")
