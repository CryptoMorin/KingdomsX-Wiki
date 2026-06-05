module.exports = {
  kingdomSidebar: [
    'Index',

    'Features',

    {
      type: 'category',
      label: '📥 Installation',
      items: [
        'Installation',
        'Installation#Setup',
        'Installation#Compatibility',
      ],
    },

    'FAQ',
    'NFAQ',

    {
      type: 'category',
      label: '⚜️ Addons',
      items: [
        'Addons',
        'Outposts',
        'Peace-Treaties',
        'Map-Viewers-Addon',
        'EngineHub-Addon',
        'Admin-Tools',
      ],
    },

    {
      type: 'category',
      label: '# Basics',
      items: [
        'Introduction',

        {
          type: 'category',
          label: '⌨️ Commands',
          items: [
            'Commands',
            'Commands#Players',
            'Commands#Admins',
          ],
        },

        'Permissions',

        {
          type: 'category',
          label: '🔣 Placeholders',
          items: [
            'Placeholders',
            'Placeholders#Players',
            'Placeholders#Kingdoms',
            'Placeholders#Nations',
          ],
        },

        {
          type: 'category',
          label: '📁 Config',
          items: [
            'Config',
            'YAML',
            'Languages',
            'GUI',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: '# Advanced',
      items: [
        'Protection-Signs',
        'Mails',

        {
          type: 'category',
          label: '📚 Mechanics',
          items: [
            'Mechanics',

            {
              type: 'category',
              label: '⚔️ Invasion',
              items: [
                'Mechanics#Invasion',
                'Mechanics#Preparing',
                'Mechanics#Champion',
                'Mechanics#Mass-Wars',
              ],
            },

            'Mechanics#Structures',
            'Mechanics#Turrets',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: '# Others',
      items: [
        'Troubleshooting',

        {
          type: 'category',
          label: '💻 API',
          items: [
            'API',
            'API#Basics',
            'API#Turrets--Structures',
            'API#Metadata',
            'API#Events',
            'API#Examples',
            'API#Addons',
          ],
        },
      ],
    },
  ],
};