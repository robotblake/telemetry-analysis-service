web: bin/start-stunnel newrelic-admin run-program gunicorn atmo.wsgi:application --workers 4 --log-file -
worker: bin/start-stunnel newrelic-admin run-program python manage.py rqworker --worker-class=rq.SimpleWorker default
# django-rq doesn't support rqscheduler retry mode yet
# so we need to use the original startup script
scheduler: bin/start-stunnel newrelic-admin run-program rqscheduler --url=$REDIS_URL

release: ./bin/pre_deploy
