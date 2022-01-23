Subjects:

- event emitter: Rather domain scoped
- hidden agenda / goal: share containeres and stores between projects

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

- what about instances shared between multiple containers? No!
- Can we create "combined" contaners? Ok!

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe

Notes:

Sometimes we will need mobx transaction feature
