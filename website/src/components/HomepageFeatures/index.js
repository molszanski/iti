import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

const FeatureList = [
  {
    title: "Pure DI Upgrade",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        You are using a DI already. Progressively upgrade and reap
        <a href="/docs/intro"> ITI benefits</a>
      </>
    ),
  },
  {
    title: "Type Safe",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        If your project compiles your dependencies will resolve correctly at a
        runtime
      </>
    ),
  },
  {
    title: "Asynchronous",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <>Your app is asynchronousm so should be your framework</>,
  },
  {
    title: "React Compatible",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Useful <a href="/docs/with-react/react-full">React</a> bindings. Extract
        application business logic from a React hooks and components
      </>
    ),
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx(styles.featureBlock)}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  )
}
