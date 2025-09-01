import {defineType, defineField} from 'sanity'

export const releaseType = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'datetime',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'bpm',
      title: 'BPM',
      type: 'number',
      validation: (rule) => rule.required().min(60).max(200)
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(10)
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Format: MM:SS (e.g., "4:03")',
      validation: (rule) => rule.required().regex(/^\d{1,2}:\d{2}$/, {
        name: 'duration format',
        invert: false
      })
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(500)
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => rule.required()
        }
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'platformLinks',
      title: 'Platform Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Bandcamp', value: 'bandcamp'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'Apple Music', value: 'apple'},
                  {title: 'SoundCloud', value: 'soundcloud'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Beatport', value: 'beatport'},
                  {title: 'Juno Download', value: 'juno'}
                ]
              },
              validation: (rule) => rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({
                allowRelative: false,
                scheme: ['http', 'https']
              })
            }
          ]
        }
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: 'stems',
      title: 'Stems',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Stem Name',
              type: 'string',
              validation: (rule) => rule.required()
            },
            {
              name: 'audioFile',
              title: 'Audio File',
              type: 'file',
              options: {
                accept: '.mp3,.wav,.flac,.aac'
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      releaseDate: 'releaseDate',
      media: 'coverImage'
    },
    prepare(selection) {
      const {title, releaseDate, media} = selection
      const formattedDate = new Date(releaseDate).toLocaleDateString()
      return {
        title,
        subtitle: `Released: ${formattedDate}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Release Date, New',
      name: 'releaseDateDesc',
      by: [{field: 'releaseDate', direction: 'desc'}]
    },
    {
      title: 'Release Date, Old',
      name: 'releaseDateAsc',
      by: [{field: 'releaseDate', direction: 'asc'}]
    }
  ]
})