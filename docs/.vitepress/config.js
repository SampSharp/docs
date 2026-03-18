import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SampSharp",
  description: ".NET SA-MP",
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3c' }]
  ],
  
  themeConfig: {
    logo: '/images/sampsharp.png',
    
    nav: [
      { text: 'Documentation', link: '/introduction' },
      { text: 'API', link: 'https://api.sampsharp.net/' },
      { text: 'Download', link: 'https://github.com/ikkentim/sampsharp/releases' }
    ],

    sidebar: [
      {
        text: 'Basics',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Running a Server in Production', link: '/production' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'GameModeBuilder', link: '/game-mode-builder' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Natives', link: '/natives' },
          { text: 'Threading', link: '/threading' }
        ]
      },
      {
        text: 'GameMode Framework',
        items: [
          { text: 'GameMode', link: '/gamemode-game-mode' },
          { text: 'Players', link: '/gamemode-players' },
          { text: 'Dialogs', link: '/gamemode-dialogs' },
          { text: 'TextDraws', link: '/gamemode-textdraws' },
          { text: 'Player-Commands', link: '/gamemode-player-commands' },
          { text: 'Accessing server.cfg', link: '/gamemode-accessing-server.cfg' },
          { text: 'Controllers', link: '/gamemode-controllers' },
          { text: 'Callbacks', link: '/gamemode-callbacks' },
          { text: 'Extensions', link: '/gamemode-extensions' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ikkentim/sampsharp' },
      { icon: 'discord', link: 'https://discord.com/invite/gwcHpqp' }
    ],

    footer: {
      message: 'SampSharp - Copyright © 2015 - 2026 Tim Potze',
      copyright: ''
    }
  }
})
