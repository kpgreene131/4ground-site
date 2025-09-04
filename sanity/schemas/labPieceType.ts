import { defineType, defineField } from 'sanity';

export const labPieceType = defineType({
  name: 'labPiece',
  title: 'Lab Piece',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().min(10).max(500),
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
      description: 'Link to live demo or project',
      validation: (rule) =>
        rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to source code repository',
      validation: (rule) =>
        rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'createdDate',
      title: 'Created Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active Project',
      type: 'boolean',
      description: 'Is this project currently being worked on?',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Should this project be featured prominently?',
      initialValue: false,
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
      description: 'description',
      techStack: 'techStack',
      isActive: 'isActive',
      featured: 'featured',
      media: 'thumbnail',
    },
    prepare(selection) {
      const { title, description, techStack, isActive, featured, media } =
        selection;
      const statusEmoji = featured ? '⭐' : isActive ? '🔨' : '📦';
      const techPreview = techStack
        ? techStack.slice(0, 3).join(', ')
        : 'No tech stack';

      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${techPreview} - ${description?.substring(0, 60)}...`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'createdDate', direction: 'desc' },
      ],
    },
    {
      title: 'Created Date, Newest',
      name: 'createdDateDesc',
      by: [{ field: 'createdDate', direction: 'desc' }],
    },
    {
      title: 'Created Date, Oldest',
      name: 'createdDateAsc',
      by: [{ field: 'createdDate', direction: 'asc' }],
    },
    {
      title: 'Active Projects',
      name: 'activeFirst',
      by: [
        { field: 'isActive', direction: 'desc' },
        { field: 'createdDate', direction: 'desc' },
      ],
    },
  ],
});
