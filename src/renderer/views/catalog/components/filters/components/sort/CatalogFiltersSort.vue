<template>
  <v-select
    v-bind="{items}"
    outlined
    hide-details
    item-text="title"
    item-value="value"
    placeholder="Sorting"
    :value="_value"
    @input="_setFilterValue({filter: 'sort', value: $event})">
  </v-select>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      items: [
        {
          title: 'By newest',
          value: 1
        },
        {
          title: 'By popularity',
          value: 2
        },
      ]
    }
  },
  computed: {
    ...mapState('catalog', { _value: s => s.filters.sort.value })
  },

  methods: {
    ...mapActions('catalog', { _setFilterValue: 'setFilterValue' })
  },

}
</script>
