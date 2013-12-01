web: bundle exec puma -t ${PUMA_MIN_THREADS:-4}:${PUMA_MAX_THREADS:-6} -w ${PUMA_WORKERS:-2} -p $PORT -e ${RACK_ENV:-development}
worker: bundle exec sidekiq -e $RACK_ENV -C config/sidekiq.yml