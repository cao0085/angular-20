docker-compose up -d --build
docker-compose exec node-app bash
npm install -g @angular/cli@20
ng serve --port 4040 --host 0.0.0.0

// hot reload
"serve": {
    "options": {
    "poll": 2000
    },