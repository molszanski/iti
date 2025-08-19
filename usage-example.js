import { createContainer } from './kv-storage.js'

// Example 1: Basic chained usage (like iti)
console.log('=== Basic Chained Usage ===')
const container = createContainer()
  .add({
    name: 'John',
    age: () => 30,
    greeting: (items) => `Hello, ${items.name}!`
  })
  .add((items) => ({
    fullName: () => `${items.name} Doe`,
    profile: () => ({
      name: items.name,
      age: items.age,
      greeting: items.greeting
    })
  }))

console.log(await container.get('name')) // 'John'
console.log(await container.get('age')) // 30
console.log(await container.get('greeting')) // 'Hello, John!'
console.log(await container.get('fullName')) // 'John Doe'
console.log(await container.get('profile')) // { name: 'John', age: 30, greeting: 'Hello, John!' }

// Example 2: With disposers for cleanup
console.log('\n=== With Disposers ===')
const dbContainer = createContainer()
  .add({
    connection: () => {
      console.log('Creating database connection...')
      return { id: 'db-123', connected: true }
    }
  })
  .addDisposer({
    connection: (connection) => {
      console.log(`Closing connection ${connection.id}...`)
      connection.connected = false
    }
  })

const connection = await dbContainer.get('connection')
console.log('Connection:', connection)

// Later, dispose the connection
await dbContainer.dispose('connection')

// Example 3: Upsert for overwriting values
console.log('\n=== Upsert Example ===')
const userContainer = createContainer()
  .add({
    name: 'Alice',
    email: 'alice@example.com'
  })
  .upsert({
    name: 'Alice Smith', // Overwrites existing name
    role: 'admin' // Adds new field
  })

console.log(await userContainer.get('name')) // 'Alice Smith'
console.log(await userContainer.get('email')) // 'alice@example.com'
console.log(await userContainer.get('role')) // 'admin'

// Example 4: Async values and dependencies
console.log('\n=== Async Values ===')
const asyncContainer = createContainer()
  .add({
    userData: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      return { id: 1, name: 'Bob', role: 'admin' }
    }
  })
  .add((items) => ({
    permissions: async () => {
      const userData = await items.userData
      return userData.role === 'admin' ? ['read', 'write', 'delete'] : ['read']
    },
    userProfile: async () => {
      const userData = await items.userData
      const permissions = await items.permissions
      return {
        ...userData,
        permissions,
        lastLogin: new Date()
      }
    }
  }))

const userData = await asyncContainer.get('userData')
const permissions = await asyncContainer.get('permissions')
const profile = await asyncContainer.get('userProfile')

console.log('User data:', userData)
console.log('Permissions:', permissions)
console.log('Profile:', profile)

// Example 5: Batch operations
console.log('\n=== Batch Operations ===')
const batchContainer = createContainer()
  .add({
    a: 1,
    b: () => 2,
    c: () => 3,
    d: async () => 4
  })

const values = await batchContainer.getMany(['a', 'b', 'c', 'd'])
console.log('Batch values:', values) // { a: 1, b: 2, c: 3, d: 4 }

// Example 6: Event subscriptions
console.log('\n=== Event Subscriptions ===')
const eventContainer = createContainer()
  .add({
    counter: 0
  })

// Subscribe to changes
const unsubscribe = eventContainer.subscribe('counter', (value, error) => {
  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Counter changed to:', value)
  }
})

// Set values (triggers events)
const container1 = eventContainer.upsert({ counter: 1 })
const container2 = container1.upsert({ counter: 2 })

// Unsubscribe
unsubscribe()

// Example 7: Delete operations
console.log('\n=== Delete Operations ===')
const deleteContainer = createContainer()
  .add({
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'user'
  })

console.log('Before delete:', await deleteContainer.getMany(['name', 'email', 'role']))

const containerAfterDelete = deleteContainer.delete('email')
console.log('After delete:', await containerAfterDelete.getMany(['name', 'role']))
console.log('Has email?', containerAfterDelete.has('email')) // false

// Example 8: Complex dependency chain
console.log('\n=== Complex Dependencies ===')
const appContainer = createContainer()
  .add({
    config: () => ({
      apiUrl: 'https://api.example.com',
      timeout: 5000
    }),
    logger: () => ({
      log: (msg) => console.log(`[LOG] ${msg}`),
      error: (msg) => console.error(`[ERROR] ${msg}`)
    })
  })
  .add((items) => ({
    apiClient: async () => {
      const config = await items.config
      const logger = await items.logger
      
      logger.log(`Initializing API client for ${config.apiUrl}`)
      
      return {
        baseUrl: config.apiUrl,
        timeout: config.timeout,
        request: async (endpoint) => {
          logger.log(`Making request to ${endpoint}`)
          return { data: `Response from ${endpoint}` }
        }
      }
    }
  }))
  .add((items) => ({
    userService: async () => {
      const apiClient = await items.apiClient
      const logger = await items.logger
      
      return {
        getUsers: async () => {
          logger.log('Fetching users...')
          return await apiClient.request('/users')
        },
        getUser: async (id) => {
          logger.log(`Fetching user ${id}...`)
          return await apiClient.request(`/users/${id}`)
        }
      }
    }
  }))
  .addDisposer({
    apiClient: async (client) => {
      console.log('Closing API client...')
      // Cleanup logic here
    }
  })

const userService = await appContainer.get('userService')
const users = await userService.getUsers()
console.log('Users:', users)

// Example 9: Utility methods
console.log('\n=== Utility Methods ===')
console.log('Container keys:', container.keys())
console.log('Container size:', container.size())
console.log('Has name?', container.has('name')) // true
console.log('Has unknown?', container.has('unknown')) // false

// Example 10: Cleanup
console.log('\n=== Cleanup ===')
await appContainer.disposeAll()
console.log('All containers cleaned up!')