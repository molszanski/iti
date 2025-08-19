// Simple event emitter implementation
function createEventEmitter() {
  const events = {}
  
  return {
    on(event, callback) {
      if (!events[event]) events[event] = []
      events[event].push(callback)
      return () => {
        events[event] = events[event].filter(cb => cb !== callback)
      }
    },
    
    emit(event, ...args) {
      if (events[event]) {
        events[event].forEach(callback => callback(...args))
      }
    }
  }
}

// Create container state
function createContainerState() {
  return {
    cache: {},
    context: {},
    disposeCtx: {},
    events: createEventEmitter()
  }
}

// Helper function to resolve a value (handle functions and promises)
async function resolveValue(value) {
  if (typeof value === 'function') {
    const result = value()
    return result instanceof Promise ? await result : result
  }
  return value
}

// Helper function to create context getter
function createContextGetter(state) {
  const getter = {}
  
  for (const key of Object.keys(state.context)) {
    Object.defineProperty(getter, key, {
      get() {
        return get(state, key)
      },
      enumerable: true
    })
  }
  
  return getter
}

// Core get function
async function get(state, key) {
  // Check cache first
  if (key in state.cache) {
    return state.cache[key]
  }
  
  // Check context
  if (key in state.context) {
    const value = state.context[key]
    const resolved = await resolveValue(value)
    state.cache[key] = resolved
    return resolved
  }
  
  throw new Error(`Key '${key}' not found`)
}

// Main container implementation
function createContainer() {
  const state = createContainerState()
  
  return {
    // Core methods that return new containers
    add(items) {
      const newState = { ...state }
      newState.context = { ...state.context }
      
      const itemsToAdd = typeof items === 'function' 
        ? items(createContextGetter(state))
        : items
      
      // Check for duplicates
      const duplicates = Object.keys(itemsToAdd).filter(key => key in state.context)
      if (duplicates.length > 0) {
        throw new Error(`Keys already exist: ${duplicates.join(', ')}`)
      }
      
      Object.assign(newState.context, itemsToAdd)
      
      // Emit events for new items
      for (const [key, value] of Object.entries(itemsToAdd)) {
        newState.events.emit('itemSet', { key, value })
      }
      
      return createContainerFromState(newState)
    },
    
    upsert(items) {
      const newState = { ...state }
      newState.context = { ...state.context }
      
      const itemsToUpsert = typeof items === 'function'
        ? items(createContextGetter(state))
        : items
      
      Object.assign(newState.context, itemsToUpsert)
      
      // Emit events for upserted items
      for (const [key, value] of Object.entries(itemsToUpsert)) {
        newState.events.emit('itemSet', { key, value })
      }
      
      return createContainerFromState(newState)
    },
    
    addDisposer(disposers) {
      const newState = { ...state }
      newState.disposeCtx = { ...state.disposeCtx }
      
      const disposersToAdd = typeof disposers === 'function'
        ? disposers(createContextGetter(state))
        : disposers
      
      // Check for duplicates
      const duplicates = Object.keys(disposersToAdd).filter(key => key in state.disposeCtx)
      if (duplicates.length > 0) {
        throw new Error(`Disposer keys already exist: ${duplicates.join(', ')}`)
      }
      
      Object.assign(newState.disposeCtx, disposersToAdd)
      
      return createContainerFromState(newState)
    },
    
    delete(key) {
      const newState = { ...state }
      newState.context = { ...state.context }
      newState.cache = { ...state.cache }
      newState.disposeCtx = { ...state.disposeCtx }
      
      delete newState.context[key]
      delete newState.cache[key]
      delete newState.disposeCtx[key]
      
      newState.events.emit('itemDeleted', { key })
      
      return createContainerFromState(newState)
    },
    
    // Getter methods
    async get(key) {
      return get(state, key)
    },
    
    async getMany(keys) {
      const result = {}
      for (const key of keys) {
        result[key] = await get(state, key)
      }
      return result
    },
    
    has(key) {
      return key in state.context || key in state.cache
    },
    
    // Utility methods
    keys() {
      return Object.keys(state.context)
    },
    
    size() {
      return Object.keys(state.context).length
    },
    
    // Disposal methods
    async dispose(key) {
      if (key in state.disposeCtx && key in state.cache) {
        const disposer = state.disposeCtx[key]
        const value = state.cache[key]
        
        if (typeof disposer === 'function') {
          await disposer(value)
        }
        
        delete state.cache[key]
        state.events.emit('itemDisposed', { key })
      }
    },
    
    async disposeAll() {
      const keys = Object.keys(state.disposeCtx)
      await Promise.all(keys.map(key => this.dispose(key)))
    },
    
    // Subscription methods
    subscribe(key, callback) {
      const unsubscribeSet = state.events.on('itemSet', (payload) => {
        if (payload.key === key) {
          callback(payload.value, null)
        }
      })
      
      const unsubscribeDelete = state.events.on('itemDeleted', (payload) => {
        if (payload.key === key) {
          callback(null, new Error('Item deleted'))
        }
      })
      
      return () => {
        unsubscribeSet()
        unsubscribeDelete()
      }
    },
    
    subscribeMany(keys, callback) {
      const unsubscribers = keys.map(key => 
        this.subscribe(key, (value, error) => {
          // This is simplified - in practice you'd want to collect all values
          callback({ [key]: value }, error)
        })
      )
      
      return () => {
        unsubscribers.forEach(unsub => unsub())
      }
    },
    
    // Event emitter access
    on(event, callback) {
      return state.events.on(event, callback)
    }
  }
}

// Helper function to create container from existing state
function createContainerFromState(state) {
  const container = createContainer()
  // Copy the state to the new container
  Object.assign(container, {
    _state: state,
    get: (key) => get(state, key),
    has: (key) => key in state.context || key in state.cache,
    keys: () => Object.keys(state.context),
    size: () => Object.keys(state.context).length,
    dispose: async (key) => {
      if (key in state.disposeCtx && key in state.cache) {
        const disposer = state.disposeCtx[key]
        const value = state.cache[key]
        
        if (typeof disposer === 'function') {
          await disposer(value)
        }
        
        delete state.cache[key]
        state.events.emit('itemDisposed', { key })
      }
    },
    disposeAll: async () => {
      const keys = Object.keys(state.disposeCtx)
      await Promise.all(keys.map(key => container.dispose(key)))
    },
    on: (event, callback) => state.events.on(event, callback)
  })
  
  return container
}

// Export the main function
export { createContainer }

// Alternative name for backward compatibility
export const createKVStorage = createContainer