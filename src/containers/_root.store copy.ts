import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
import { B_Container, provideBContainer } from "./container.b"

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  aCont: Promise<A_Container>
  bCont: Promise<B_Container>
}

type ContainerRegistryAsFunctions = {
  [P in keyof ContainerRegistry]: () => ContainerRegistry[P]
}

class AppContainerDepenencyTracker
  extends RootContainer<ContainerRegistry>
  implements ContainerRegistryAsFunctions
{
  auth = async () => provideAuthContainer()
  aCont = async () => provideAContainer(await this.auth())
  bCont = async () => provideBContainer(await this.auth(), await this.aCont())
}

export class AppContainer extends RootContainer<ContainerRegistry> {
  private ZZZ: ContainerRegistryAsFunctions
  constructor() {
    super()
    this.ZZZ = new AppContainerDepenencyTracker()
  }

  public love() {
    const FF: any = {}

    _.forEach(this.ZZZ, (v: any, k: any) => {
      FF[k] = async () => this.getGenericContainer(k, v)
    })
    return FF
  }
}
