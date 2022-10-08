// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ITI",
  tagline:
    "1kB Typesafe dependency injection framework for TypeScript and JavaScript with a unique support for async flow",
  url: "https://itijs.org",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "molszanski", // Usually your GitHub org/user name.
  projectName: "iti", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "itijs.org",
    },
  ],

  plugins: [require.resolve("docusaurus-lunr-search")],

  // themes: [
  //   // ... Your other themes.
  //   [
  //     require.resolve("@easyops-cn/docusaurus-search-local"),
  //     {
  //       // ... Your options.
  //       // `hashed` is recommended as long-term-cache of index file is possible.
  //       hashed: true,
  //       // For Docs using Chinese, The `language` is recommended to set to:
  //       // ```
  //       // language: ["en", "zh"],
  //       // ```
  //     },
  //   ],
  // ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "ITI docs",
        logo: {
          alt: "ITI Grape Logo Logo",
          src: "img/iti/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "right",
            label: "Docs",
          },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/molszanski/iti",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Docs",
                to: "/docs/intro",
              },
            ],
          },
          // {
          //   title: "Community",
          //   items: [
          //     {
          //       label: "Stack Overflow",
          //       href: "https://stackoverflow.com/questions/tagged/docusaurus",
          //     },
          //     {
          //       label: "Discord",
          //       href: "https://discordapp.com/invite/docusaurus",
          //     },
          //     {
          //       label: "Twitter",
          //       href: "https://twitter.com/docusaurus",
          //     },
          //   ],
          // },
          {
            title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                label: "GitHub",
                href: "https://github.com/molszanski/iti",
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} Iti Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
