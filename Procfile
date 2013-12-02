web: bundle exec passenger start -p $PORT --max-pool-size 3
worker: bundle exec sidekiq -e $RACK_ENV -C config/sidekiq.yml