<template>
<div class="row">
  <q-input outlined :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" label="Your nick" @keyup.enter="$emit('connect')" />
  <q-btn color="primary" label="Connect" @click="$emit('connect')" />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  setup () {
    return {}
  },
  props: {
    modelValue: {
      type: String
    }
  },
  methods: {
  },
  emits: ['connect', 'update:modelValue']
}
</script>
