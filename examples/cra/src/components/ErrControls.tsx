import React, { useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useContainer, useContainerSet } from "../containers/_container.hooks"
import { EnsureKitchenProvider, useNewKitchenContext } from "./EnsureKitchen"

export const ErrControls = () => {
  return (
    <div>
      new Err Controls:
      {/* <Simple />
      <SimpleAsyncErr />
      <NestedErr /> */}
      <SimpleSyncErr />
    </div>
  )
}

const Simple = () => {
  const [a, err] = useContainer().aCont
  if (!a) return <>A is loading</>
  return <div>Sync Err: {a.a1.getName()}</div>
}

const SimpleSyncErr = () => {
  const [a, err] = useContainer().errSync
  if (!err) {
    return null
  }

  return <div>Sync Err1: {err.message} </div>
}

const SimpleAsyncErr = () => {
  const [a, err] = useContainer().errAsync
  if (!err) {
    return null
  }

  return <div>Async Sync Err2: {err.message} </div>
}

const NestedErr = () => {
  const [a, err] = useContainer().errNested
  console.log("~~~ err", err)
  if (!a) {
    return null
  }

  console.log(a)

  return <div>Async Nested Sync Err2: </div>
}
