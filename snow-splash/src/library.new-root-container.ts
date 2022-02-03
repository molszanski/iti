// import { Assign } from "utility-types"
import mitt from "mitt"

type Assign<OldContext extends object, NewContext extends object> = {
  [Token in keyof (OldContext & {
    [NT in keyof NewContext]: never
  })]: Token extends keyof OldContext
    ? OldContext[Token]
    : Token extends keyof NewContext
    ? NewContext[Token]
    : never
}

abstract class AbstractNode<NodeContext extends object> {
  public addValue<Token extends string, ProvidedTokenType>(
    token: Token,
    value: ProvidedTokenType,
  ): AbstractNode<Assign<NodeContext, { [T in Token]: ProvidedTokenType }>> {
    return new Node(this, { [token]: value }) as any
  }

  public get<Token extends keyof NodeContext>(
    token: Token,
  ): NodeContext[Token] {
    return this.resolve(token)
  }

  protected abstract resolve<Token extends keyof NodeContext>(
    token: Token,
  ): NodeContext[Token]
}

class RootNode extends AbstractNode<{}> {
  public override resolve(token: never): never {
    throw new Error(`nope`)
  }
}

class Node<
  ParentNodeContext extends object,
  ChildNodeContext extends object,
> extends AbstractNode<Assign<ParentNodeContext, ChildNodeContext>> {
  constructor(
    readonly parent: AbstractNode<ParentNodeContext>,
    readonly child: ChildNodeContext,
  ) {
    super()
  }

  protected override resolve<
    SearchToken extends keyof Assign<ParentNodeContext, ChildNodeContext>,
  >(
    token: SearchToken,
  ): Assign<ParentNodeContext, ChildNodeContext>[SearchToken] {
    const thisNodeContext = this.child as any
    if (thisNodeContext[token] != null) {
      let value = thisNodeContext[token]
      return value
    } else {
      return this.parent.get(token as any)
    }
  }
}

export function makeRoot() {
  return new RootNode()
}

let r = makeRoot()
const node1 = r.addValue("a", 1)
const node2 = node1.addValue("b", "b")

const v1 = node2.get("a")
const v2 = node2.get("b")
// const v3 = node1.get("b")
