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
          items: ["intro", "quick-start", "usage"],
        },
        {
          label: "Reference",
          items: ["api", "faq"],
        },
        {
          label: "Guides and Examples",
          items: [
            {
              label: "React",
              items: [
                "with-react/react-full-intro",
                "with-react/configuration",
                "with-react/ensure-sync-items-availability",
              ],
            },
            {
              label: "Basic DI Examples",
              items: [
                "basic-di/manual-di",
                "basic-di/iti",
                "basic-di/iti-vs-pure",
              ],
            },
            {
              label: "Async DI Examples",
              items: [
                "async-di/manual-di",
                "async-di/iti",
                // { label: "Manual DI", slug: "async-di/manual-di" },
                // { label: "ITI", slug: "async-di/iti" },
              ],
            },
          ],
        },
        {
          label: "Advanced",
          items: [
            "patterns-and-tips",
            "playground",
            "when-not-to-use-iti",
            "alternatives",
            "benefits-of-iti",
          ],
        },
      ],
    }),
  ],
})
