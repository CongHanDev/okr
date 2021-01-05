'use strict'

const DbService = require('../mixins/db.mixin')
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin')
const serviceTransformer = require('../transformers/service.transformer')
const routers = require('../routes/service.route')

module.exports = {
  name: 'services',
  mixins: [
    DbService('services'),
    CacheCleanerMixin(['cache.clean.services']),
  ],
  /**
   * Default settings
   */
  settings: {
    fields: [
      '_id',
      'slug',
      'name',
      'category',
      'description',
      'created_at',
      'updated_at',
      'deleted_at',
    ],
    populates: {
      category: {
        action: 'category.get',
      },
    },
    entityValidator: {
      slug: { type: 'string' },
      name: { type: 'string' },
      category: { type: 'string' },
      description: { type: 'string', optional: true },
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Get
     *
     */

    get: {
      ...routers.get,
    },

    /**
     * List
     *
     */
    list: {
      ...routers.list,
    },
    /**
     * Update
     *
     */
    update: {
      ...routers.update,
    },

    /**
     * Remove
     *
     */
    remove: {
      ...routers.remove,
    },
  },

  /**
   * Methods
   */
  methods: {},
}
