<template>
  <div>
    <Dropdown trigger="click" @on-click="selectLang">
      <a href="javascript:void(0)">
        {{ title }}
        <Icon :size="18" type="md-arrow-dropdown" />
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localList" :name="key" :key="`lang-${key}`">{{ value }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({name: 'Language'})
export default class Language extends Vue {
  @Prop({ default: 'zh-CN' })
  lang?: string

  langList:{[idx:string]:string}={
    'zh-CN': '语言',
    'zh-TW': '語言',
    'en-US': 'Lang'
  }

  localList:{[idx:string]:string}={
    'zh-CN': '中文简体',
    'zh-TW': '中文繁体',
    'en-US': 'English'
  }

  @Watch("lang")
  onlang (lang:string) {
    if (lang&&Vue.prototype.$i18n) {
      Vue.prototype.$i18n.locale = lang
    }
  }

  get title () {
    return this.langList[this.lang as string]
  }

  selectLang (name:string) {
    this.$emit('on-lang-change', name)
  }
}
</script>
