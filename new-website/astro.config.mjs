// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import catppuccin from "@catppuccin/starlight"

// https://astro.build/config
export default defineConfig({
  site: "https://itijs.org",
  integrations: [
    starlight({
      title: "ITI",
      description:
        "1kB Typesafe dependency injection framework for TypeScript and JavaScript with a unique support for async flow",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/molszanski/iti",
        },
      ],
      plugins: [
        catppuccin({
          dark: { flavor: "macchiato", accent: "sky" },
          light: { flavor: "latte", accent: "sky" },
        }),
      ],
      head: [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://cloud.umami.is/script.js",
            "data-website-id": "debd2f2d-a6f2-41b6-b00a-40bec1fdc146",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            "intro",
            "quick-start",
            "when-not-to-use-iti",
            "usage",
            // { label: "Introduction", slug: "intro" },
            // { label: "Quick Start", slug: "quick-start" },
            // { label: "When NOT to use ITI", slug: "when-not-to-use-iti" },
            // { label: "Usage", slug: "usage" },
          ],
        },
        {
          label: "Reference",
          items: [
            "api",
            { label: "FAQ", slug: "faq" },
            // { label: "Introduction", slug: "intro" },
            // { label: "Quick Start", slug: "quick-start" },
            // { label: "When NOT to use ITI", slug: "when-not-to-use-iti" },
            // { label: "Usage", slug: "usage" },
          ],
        },

        {
          label: "React",
          items: [
            "with-react/react-full-intro",
            "with-react/configuration",
            "with-react/ensure-sync-items-availability",
            // { label: "Basic Usage", slug: "with-react/basic" },
            // { label: "Configuration", slug: "with-react/configuration" },
            // { label: "Full React Example", slug: "with-react/react-full" },
          ],
        },
        {
          label: "Basic DI Examples",
          items: [
            { label: "Manual DI", slug: "basic-di/manual-di" },
            { label: "ITI", slug: "basic-di/iti" },
            { label: "ITI vs Pure", slug: "basic-di/iti-vs-pure" },
          ],
        },
        {
          label: "Async DI Examples",
          items: [
            { label: "Manual DI", slug: "async-di/manual-di" },
            { label: "ITI", slug: "async-di/iti" },
          ],
        },
        {
          label: "Advanced",
          items: [
            { label: "Patterns and Tips", slug: "patterns-and-tips" },
            { label: "Playground", slug: "playground" },
            { label: "Alternatives", slug: "alternatives" },
            { label: "Benefits of ITI", slug: "benefits-of-iti" },
          ],
        },
      ],
    }),
  ],
})
