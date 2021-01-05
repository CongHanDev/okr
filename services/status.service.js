'use strict'

const DbService = require('../mixins/db.mixin')
const routers = require('../routes/status.route')
const statusTransformer = require('../transformers/status.transformer')
const CacheCleanerMixin = require('../mixins/cache.cleaner.mixin')

module.exports = {
  name: 'status',
  mixins: [
    DbService('status'),
    CacheCleanerMixin(['cache.clean.status']),
  ],
  /**
   * Default settings
   */
  settings: {
    fields: [
      '_id',
      'slug',
      'name',
      'type',
      'description',
      'created_at',
      'updated_at',
      'deleted_at',
    ],
    entityValidator: {
      slug: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string' },
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
