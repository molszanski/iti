import { useEffect } from "react"

// async flow
class domController {
  constructor() {
    this._domReady = new Promise((resolve, reject) => {
      this.cb = resolve
    })
  }

  markDomAsDone() {
    this.cb()
  }

  domIsReady() {
    return this._domReady
  }
}

export async function provideProductDriverContainer(domController, a) {
  await domController.domIsReady()

  const pd = new PD()
  await pd.initRenderer()

  await wait(200)
  const b2 = new B2(auth.auth, a.a1)

  return {
    b1,
    b2,
  }
}

export const Main = () => {
  const { domController } = useStufContainer()
  useEffect(() => {
    setTimeout(() => {
      domController.markDomAsDone()
    }, 500)
  }, [])
  return (
    <div>
      Main Component: <Profile />
    </div>
  )
}
