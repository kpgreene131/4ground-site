import { defineType, defineField } from 'sanity';

export const showType = defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Show Title',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showDate',
      title: 'Show Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(50),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(50),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Past', value: 'past' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'flyer',
      title: 'Event Flyer',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue',
      city: 'city',
      showDate: 'showDate',
      status: 'status',
      media: 'flyer',
    },
    prepare(selection) {
      const { title, venue, city, showDate, status, media } = selection;
      const formattedDate = new Date(showDate).toLocaleDateString();
      const statusEmoji =
        status === 'upcoming' ? '🎵' : status === 'past' ? '✅' : '❌';

      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${venue}, ${city} - ${formattedDate}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Show Date, Newest First',
      name: 'showDateDesc',
      by: [{ field: 'showDate', direction: 'desc' }],
    },
    {
      title: 'Show Date, Oldest First',
      name: 'showDateAsc',
      by: [{ field: 'showDate', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusOrder',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'showDate', direction: 'desc' },
      ],
    },
  ],
});
