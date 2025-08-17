import React from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import HomepageFeatures from "@site/src/components/HomepageFeatures"

import styles from "./index.module.css"

const Logo = require("@site/static/img/iti/logo.svg").default

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroLogo}>
          {/* <Svg className={styles.featureSvg} role="img" /> */}
          <Logo />
          <h1 className="hero__title">{siteConfig.title}</h1>
        </div>

        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quick-start"
          >
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/playground"
          >
            Try a Demo
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Features
          </Link>

          <Link className="button button--secondary button--lg" to="/docs/why">
            Why ITI
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="https://github.com/molszanski/iti"
          >
            View on Github
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title} | Depenendcy Injection Framwork for TypeScript and JavaScript`}
      description="Depenendcy Injection Framwork for TypeScript and JavaScript"
    >
      <HomepageHeader />
      <main className={styles.main}>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
