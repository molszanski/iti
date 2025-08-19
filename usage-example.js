import { createKVStorage, set, get, addDisposer, disposeAll, createBuilder } from './kv-storage.js'

// Example 1: Basic usage
console.log('=== Basic Usage ===')
const storage = createKVStorage()

// Set values (can be functions that return values)
const storage1 = set(storage, 'name', 'John')
const storage2 = set(storage1, 'age', () => 30)
const storage3 = set(storage2, 'greeting', () => `Hello, ${get(storage2, 'name')}!`)

console.log(get(storage3, 'name')) // 'John'
console.log(get(storage3, 'age')) // 30
console.log(get(storage3, 'greeting')) // 'Hello, John!'

// Example 2: With disposers for cleanup
console.log('\n=== With Disposers ===')
const dbStorage = createKVStorage()

const dbStorage1 = set(dbStorage, 'connection', () => {
  console.log('Creating database connection...')
  return { id: 'db-123', connected: true }
})

const dbStorage2 = addDisposer(dbStorage1, 'connection', (connection) => {
  console.log(`Closing connection ${connection.id}...`)
  connection.connected = false
})

const connection = get(dbStorage2, 'connection')
console.log('Connection:', connection)

// Later, dispose the connection
await dispose(dbStorage2, 'connection')

// Example 3: Builder pattern for fluent API
console.log('\n=== Builder Pattern ===')
const userStorage = createBuilder()
  .set('id', 123)
  .set('name', 'Alice')
  .set('email', () => 'alice@example.com')
  .set('profile', () => ({
    avatar: 'avatar.jpg',
    bio: 'Software developer'
  }))
  .addDisposer('profile', (profile) => {
    console.log(`Cleaning up profile for ${profile.bio}`)
  })
  .build()

console.log(get(userStorage, 'id')) // 123
console.log(get(userStorage, 'name')) // 'Alice'
console.log(get(userStorage, 'email')) // 'alice@example.com'
console.log(get(userStorage, 'profile')) // { avatar: 'avatar.jpg', bio: 'Software developer' }

// Example 4: Async values
console.log('\n=== Async Values ===')
const asyncStorage = createKVStorage()

const asyncStorage1 = set(asyncStorage, 'userData', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  return { id: 1, name: 'Bob', role: 'admin' }
})

const asyncStorage2 = set(asyncStorage1, 'permissions', async () => {
  const userData = await get(asyncStorage1, 'userData')
  return userData.role === 'admin' ? ['read', 'write', 'delete'] : ['read']
})

// Get async values
const userData = await get(asyncStorage2, 'userData')
const permissions = await get(asyncStorage2, 'permissions')

console.log('User data:', userData)
console.log('Permissions:', permissions)

// Example 5: Event subscriptions
console.log('\n=== Event Subscriptions ===')
const eventStorage = createKVStorage()

// Subscribe to changes
const unsubscribe = subscribe(eventStorage, 'counter', (value, error) => {
  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Counter changed to:', value)
  }
})

// Set values (triggers events)
const eventStorage1 = set(eventStorage, 'counter', 0)
const eventStorage2 = set(eventStorage1, 'counter', 1)
const eventStorage3 = set(eventStorage2, 'counter', 2)

// Unsubscribe
unsubscribe()

// Example 6: Batch operations
console.log('\n=== Batch Operations ===')
const batchStorage = createKVStorage()

const batchStorage1 = setMany(batchStorage, {
  a: 1,
  b: () => 2,
  c: () => 3,
  d: async () => 4
})

const values = await getMany(batchStorage1, ['a', 'b', 'c', 'd'])
console.log('Batch values:', values) // { a: 1, b: 2, c: 3, d: 4 }

// Example 7: Cleanup
console.log('\n=== Cleanup ===')
await disposeAll(userStorage)
await disposeAll(asyncStorage2)
await disposeAll(batchStorage1)

console.log('All storage cleaned up!')