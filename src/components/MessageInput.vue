<template>
<div class="row">
  <q-input outlined :modelValue="modelValue" 
  @update:modelValue="$emit('update:modelValue', $event)" label="Message" 
  @keyup.enter="$emit('send')" />
  <q-btn color="primary" label="Send" @click="$emit('send')" />
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
  emits: ['send', 'update:modelValue']
}
</script>
