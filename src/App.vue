<template>
  <div class="uk-container uk-container-expand">
    <div class="uk-margin-top" uk-grid>
      <div class="uk-width-1-3">
        <form>
          <fieldset class="uk-fieldset">
            <legend class="uk-legend">Configure</legend>

            <div class="uk-margin">
              <input class="uk-input" type="text" v-model="token" placeholder="api token" aria-label="Input">
            </div>
            <div class="uk-margin">
              <input class="uk-input" type="text" v-model="basePath" placeholder="/work/dir" aria-label="Input">
            </div>
          </fieldset>
        </form>
      </div>
      <div class="uk-width-2-3">
        <div class="uk-placeholder uk-text-center uk-margin-top" @drop="onFilesDropped">
          <span uk-icon="icon: cloud-upload" class="uk-margin-right"></span>
          <span class="uk-text-middle">Attach binaries by dropping them here or</span>
          <div class="uk-margin-left" uk-form-custom>
            <input type="file" multiple @change="filesSelected">
            <span class="uk-link">selecting one</span>
          </div>
        </div>
        <ul class="uk-list">
          <li v-for="file in loadedFiles">
            <dl class="uk-description-list">
              <dt>{{ file.name }}</dt>
              <dd>{{ file.public_url }}</dd>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {DiskApi, type ResourceMeta} from '@/stores/disk-api';

const token = ref('')
const basePath = ref('')
const diskApi = new DiskApi(token.value)
const loadedFiles = ref([] as ResourceMeta[])

const onFilesDropped = (e: Event) => {
  e.preventDefault()
  console.log(e)
}

const filesSelected = (e: Event) => {
  const files: FileList | null = (e.target as HTMLInputElement).files
  return [...files ?? []]
  .forEach(
      f => {
        const path = `${basePath.value}/${f.name}`
        return diskApi.uploadResource(f, path)
        .then(() => diskApi.publishResource(path))
        .then(() => diskApi.resource(path))
        .then(res => loadedFiles.value = [...loadedFiles.value, res])
      })
}


onMounted(() => {
})

</script>

<style src="uikit/dist/css/uikit.min.css"></style>
