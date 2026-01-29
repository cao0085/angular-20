# Angular20 ERP System

<!-- 這個專案用來練習 ERP System -->
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.12.

[ref1](http://v20.angular.dev/guide/signals)
[ref2](https://nx.dev/blog/angular-state-management-2025)
[ref3](https://modernangular.com/articles/service-with-a-signal-in-angular)

## Development server

To start a local development server in docker, run:

```bash
docker-compose up -d --build
docker-compose exec node-app bash
npm install -g @angular/cli@20

# ng
ng serve --port YOUR DOCKER PORT --host 0.0.0.0
ng generate component <component-name>
ng generate --help
ng build
```

## Auth Pattern



## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
