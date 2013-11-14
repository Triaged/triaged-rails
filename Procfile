web: bundle exec thin start -p $PORT
worker: bundle exec sidekiq -e $RACK_ENV -C config/sidekiq.yml