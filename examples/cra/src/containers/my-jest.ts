export function itAsyncDone(
  name: string,
  cb: (done: jest.DoneCallback) => Promise<void>,
  timeout?: number,
) {
  it(
    name,
    (done) => {
      let doneCalled = false
      const wrappedDone: jest.DoneCallback = (...args) => {
        if (doneCalled) {
          return
        }

        doneCalled = true
        done(...args)
      }

      wrappedDone.fail = (err) => {
        if (doneCalled) {
          return
        }

        doneCalled = true

        done.fail(err)
      }

      cb(wrappedDone).catch(wrappedDone)
    },
    timeout,
  )
}
