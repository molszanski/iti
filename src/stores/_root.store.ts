import { configure, observable, action } from "mobx"
import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
// don't allow state modifications outside actions
configure({ enforceActions: "always" })

// type EditotContainers = AuthContainer | A_Container;``

export class RootContainer {
  private authContainer?: AuthContainer
  private a?: A_Container

  public async getAuthContainer(): Promise<AuthContainer> {
    if (!this.authContainer) {
      this.authContainer = await provideAuthContainer()
    }

    return this.authContainer
  }

  public async getA_Container(): Promise<A_Container> {
    if (!this.a) {
      const auth = await this.getAuthContainer()
      this.a = await provideAContainer(auth)
    }

    return this.a
  }
}

/**


import useSWR from 'swr'



function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}


function Profile() {
  const { cont, error } = useEcommerce()
  if(!cont) return <div>loading...</div> | null
  const {pricing, currencyStore, taxStore} = cont

  return <div>hello {data.name}!</div>
}


 */
