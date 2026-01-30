# ERP System By Angular 20

Built with **Angular 20** Standalone Components architecture, featuring comprehensive permission management, dynamic tab system, and modular design.

## Background

This project serves as a practice ground for validating core Angular 20 concepts before introducing them into production:
- **Signals** - Next-generation reactive state management
- **Standalone Components** - Module-free component architecture
- **Dependency Injection** - Service-based architecture with `inject()` function
- **RBAC** - Role-Based Access Control system
- **Tab Service** - Dynamic tab management service
- **RouteReuse Strategy** - Route reuse strategy for preserving component state

These concepts have been successfully adopted in production applications.

**Note:** This project focuses on architectural patterns and business logic implementation. The UI uses basic PrimeNG components without extensive styling customization.

## Project Architecture

```
src/app/
├── core/                           
│   ├── layout/                     
│   │   ├── main-layout.component.ts    # Sidebar + Header + TabContainer
│   │   ├── sidebar.component.ts
│   │   ├── header.component.ts
│   │   └── tab-container.component.ts  # main container (features component)
│   ├── services/                  # DI Service
│   │   ├── tab.service.ts
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   └── .....service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/               # HTTP
│   └── strategies/                 # no state function
│
├── features/                       # render in tab-container    
│   ├── basic-system/
│   │   ├── system-log.component.ts
│   │   └── system-directory.component.ts
│   └── other-system/
│       ├── test.component.ts
│       └── test2.component.ts
│
├── pages/                          # single pages
│   └── login
│
├── mockDB/                         # Mock Data
│   └── userPermission.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── app.routes.ts
├── app.config.ts
└── app.ts
```

### Development

```bash
docker-compose up -d --build
# In Container
ng serve --port 4040 --host 0.0.0.0
```

## Conclusion

After completing this project, several issues were identified that would require attention in a production environment:

- **RouteReuse Recursion** - Complex nested route scenarios may cause recursive reuse issues
- **Auth Token** - App init Token refresh flow and request retry mechanism need proper implementation
- **Storage State Sync** - State synchronization between localStorage and application state requires more robust handling
- **Circular Dependencies** - Service injection order needs careful consideration

These issues have been resolved in production applications, but the updated code contains proprietary business logic and cannot be shared in this public repository.