export default {
  kingdomSidebar: [
    'index',

    'features',

    {
      type: 'category',
      label: '📥 Installation',
      items: [
        'installation',
        'installation#setup',
        'installation#compatibility',
      ],
    },

    'faq',
    'nfaq',

    {
      type: 'category',
      label: '⚜️ Addons',
      items: [
        'addons',
        'outposts',
        'peace-treaties',
        'map-viewers-addon',
        'enginehub-addon',
        'admin-tools',
      ],
    },

    {
      type: 'category',
      label: '# Basics',
      items: [
        'introduction',

        {
          type: 'category',
          label: '⌨️ Commands',
          items: [
            'commands',
            'commands#players',
            'commands#admins',
          ],
        },

        'permissions',

        {
          type: 'category',
          label: '🔣 Placeholders',
          items: [
            'placeholders',
            'placeholders#players',
            'placeholders#kingdoms',
            'placeholders#nations',
          ],
        },

        {
          type: 'category',
          label: '📁 Config',
          items: [
            'config',
            'yaml',
            'languages',
            'gui',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: '# Advanced',
      items: [
        'protection-signs',
        'mails',

        {
          type: 'category',
          label: '📚 Mechanics',
          items: [
            'mechanics',

            {
              type: 'category',
              label: '⚔️ Invasion',
              items: [
                'mechanics#invasion',
                'mechanics#preparing',
                'mechanics#champion',
                'mechanics#mass-wars',
              ],
            },

            'mechanics#structures',
            'mechanics#turrets',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: '# Others',
      items: [
        'troubleshooting',

        {
          type: 'category',
          label: '💻 API',
          items: [
            'api',
            'api#basics',
            'api#turrets--structures',
            'api#metadata',
            'api#events',
            'api#examples',
            'api#addons',
          ],
        },
      ],
    },
  ],
};