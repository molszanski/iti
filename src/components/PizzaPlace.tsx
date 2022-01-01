import React from "react"
import { observer } from "mobx-react-lite"
import cx from "classnames"
import s from "./PizzaPlace.module.css"
import {
  useAllSuperStores,
  useDandy,
  useKitchenContainer,
  usePizzaPlaceContainer,
  // useSecondKitchenContainer,
} from "../containers/_container.hooks"
import { useGenericContainer } from "../_library/library.hooks"

export const PizzaPlace = observer(() => {
  const { container } = usePizzaPlaceContainer()

  if (!container) {
    return <>Pizza Place is loading</>
  }
  const { pizzaPlace, diningTables } = container

  return (
    <>
      <div className={cx(s.pizzaPlace, s.bricks)}>
        <h3>Pizza Place: {pizzaPlace.name}</h3>
        <h3>Open?: {pizzaPlace.isOpen ? "true" : "false"}</h3>
        <h3>Dining Tables: {diningTables.tables.length}</h3>

        <KitchenData />
      </div>
    </>
  )
})

export const KitchenData = observer(() => {
  const { container } = useKitchenContainer()
  if (!container) {
    return <>Kitchen is loading</>
  }

  //@ts-ignore
  const { kitchen, orderManager } = container
  return (
    <>
      <h3>Kitchen data: ({kitchen.kitchenName})</h3>

      <div className={cx(s.kitchenData)}>
        <div>
          <h4>Orders:</h4>
          <ul>
            {orderManager.orders.map((order, idx) => {
              return (
                <li key={idx}>
                  table: {order.table.name} | pizzastate: {order.pizza.state}
                  <ul>
                    {order.pizza.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient.name}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h4>Ingredients:</h4>
          <Inventory />
        </div>
        <div>
          <h4>Ingredients:</h4>
          <Inventory2 />
        </div>

        <div>
          <h4>Ingredients:</h4>
          <Inventory3 />
        </div>
      </div>
    </>
  )
})

export const Inventory = observer(() => {
  const { container } = useKitchenContainer()
  if (!container) {
    return <>Pizza Place is loading</>
  }
  const { ingredients } = container
  return (
    <>
      <ul>
        {ingredients.ingredientsStats.map(([name, count], idx) => (
          <li key={idx}>
            {name} - {count}
          </li>
        ))}
      </ul>
    </>
  )
})

export const Inventory2 = observer(() => {
  const { container } = useGenericContainer(
    useAllSuperStores().kitchen._container,
  )
  if (!container) return <>Loading</>

  const { ingredients } = container
  return (
    <>
      <strong>Other ingredients</strong>
      <ul>
        {ingredients.ingredientsStats.map(([name, count], idx) => (
          <li key={idx}>
            {name} - {count}
          </li>
        ))}
      </ul>
    </>
  )
})

export const Inventory3 = observer(() => {
  const [kitchen] = useDandy().kitchen()
  if (!kitchen) return <>Loading</>

  console.log("kkkk", kitchen)

  const { ingredients } = kitchen
  return (
    <>
      <strong>Other ingredients</strong>
      <ul>
        {
          // @ts-ignore
          ingredients.ingredientsStats.map(([name, count], idx: any) => (
            <li key={idx}>
              {name} - {count}
            </li>
          ))
        }
      </ul>
    </>
  )
})

// export const Inventory4 = observer(() => {
//   const root = useRootStore()

//   // useGenericContainer().kitchen()

//   if (!container) return <>Loading</>
//   console.log(container)
//   const { ingredients } = container
//   return (
//     <>
//       <strong>Other ingredients</strong>
//       <ul>
//         {ingredients.ingredientsStats.map(([name, count], idx) => (
//           <li key={idx}>
//             {name} - {count}
//           </li>
//         ))}
//       </ul>
//     </>
//   )
// })
