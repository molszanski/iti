Subjects:

- event emitter: Rather domain scoped

Containers:

- what to do with single use instances?
  - e.g. RenderPilot changes on SKU.
- Maybe drop containers and writine individual providers per store?

  - pros:
    - granular
  - cons:
    - boilerplate
    - "much work"
    - form over function
    - Lack of clear domains

- what about instances shared between multiple containers? Why not? Only avoid cyclic deps and were are home
- Can we create "combined" contaners? Sure

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe

Notes:

https://github.com/mobxjs/mobx/blob/main/packages/mobx-react-lite/src/observer.ts
