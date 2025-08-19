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

// Create storage state
function createKVStorage() {
  return {
    cache: {},
    context: {},
    disposeCtx: {},
    events: createEventEmitter()
  }
}

// Core functions
function set(storage, key, value) {
  const newStorage = { ...storage }
  newStorage.context = { ...storage.context, [key]: value }
  newStorage.events.emit('itemSet', { key, value })
  return newStorage
}

function get(storage, key) {
  // Check cache first
  if (key in storage.cache) {
    return storage.cache[key]
  }
  
  // Check context
  if (key in storage.context) {
    const value = storage.context[key]
    
    // If it's a function, execute and cache
    if (typeof value === 'function') {
      const result = value()
      storage.cache[key] = result
      return result
    }
    
    // Otherwise cache and return
    storage.cache[key] = value
    return value
  }
  
  throw new Error(`Key '${key}' not found`)
}

function has(storage, key) {
  return key in storage.context || key in storage.cache
}

function deleteItem(storage, key) {
  const newStorage = { ...storage }
  delete newStorage.context[key]
  delete newStorage.cache[key]
  delete newStorage.disposeCtx[key]
  newStorage.events.emit('itemDeleted', { key })
  return newStorage
}

function addDisposer(storage, key, disposer) {
  const newStorage = { ...storage }
  newStorage.disposeCtx = { ...storage.disposeCtx, [key]: disposer }
  return newStorage
}

async function dispose(storage, key) {
  if (key in storage.disposeCtx && key in storage.cache) {
    const disposer = storage.disposeCtx[key]
    const value = storage.cache[key]
    
    if (typeof disposer === 'function') {
      await disposer(value)
    }
    
    delete storage.cache[key]
    storage.events.emit('itemDisposed', { key })
  }
}

async function disposeAll(storage) {
  const keys = Object.keys(storage.disposeCtx)
  await Promise.all(keys.map(key => dispose(storage, key)))
}

// Batch operations
function setMany(storage, items) {
  let newStorage = storage
  for (const [key, value] of Object.entries(items)) {
    newStorage = set(newStorage, key, value)
  }
  return newStorage
}

async function getMany(storage, keys) {
  const result = {}
  for (const key of keys) {
    result[key] = await get(storage, key)
  }
  return result
}

// Subscription helpers
function subscribe(storage, key, callback) {
  const unsubscribeSet = storage.events.on('itemSet', (payload) => {
    if (payload.key === key) {
      callback(payload.value, null)
    }
  })
  
  const unsubscribeDelete = storage.events.on('itemDeleted', (payload) => {
    if (payload.key === key) {
      callback(null, new Error('Item deleted'))
    }
  })
  
  return () => {
    unsubscribeSet()
    unsubscribeDelete()
  }
}

function subscribeMany(storage, keys, callback) {
  const unsubscribers = keys.map(key => 
    subscribe(storage, key, (value, error) => {
      // This is simplified - in practice you'd want to collect all values
      callback({ [key]: value }, error)
    })
  )
  
  return () => {
    unsubscribers.forEach(unsub => unsub())
  }
}

// Utility functions
function keys(storage) {
  return Object.keys(storage.context)
}

async function values(storage) {
  const keys = Object.keys(storage.context)
  return Promise.all(keys.map(key => get(storage, key)))
}

async function entries(storage) {
  const keys = Object.keys(storage.context)
  const values = await Promise.all(keys.map(key => get(storage, key)))
  return keys.map((key, i) => [key, values[i]])
}

function size(storage) {
  return Object.keys(storage.context).length
}

async function clear(storage) {
  await disposeAll(storage)
  return createKVStorage()
}

// Builder pattern
function createBuilder() {
  let storage = createKVStorage()
  
  return {
    set(key, value) {
      storage = set(storage, key, value)
      return this
    },
    
    setMany(items) {
      storage = setMany(storage, items)
      return this
    },
    
    addDisposer(key, disposer) {
      storage = addDisposer(storage, key, disposer)
      return this
    },
    
    build() {
      return storage
    }
  }
}

// Export all functions
export {
  createKVStorage,
  set,
  get,
  has,
  deleteItem,
  addDisposer,
  dispose,
  disposeAll,
  setMany,
  getMany,
  subscribe,
  subscribeMany,
  keys,
  values,
  entries,
  size,
  clear,
  createBuilder
}