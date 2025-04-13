<template>

  <div>

    <input type="file" @change="uploadFile">

    <div v-if="uploadError" style="color: red;">{{ uploadError }}</div>

    <div v-if="fileUrl">

      <vue-files-preview :url="fileUrl" :name="fileName" />

      <p>URL: {{ fileUrl }}</p>

      <p>Filename: {{ fileName }}</p>

    </div>

  </div>

</template>

 

<script>

import { VueFilesPreview } from 'vue-files-preview';

 

export default {

  components: {

    VueFilesPreview,

  },

  data() {

    return {

      fileUrl: null,

      fileName: null,

      uploadError: null,

    };

  },

  methods: {

    async uploadFile(event) {

      this.uploadError = null;

      const file = event.target.files[0];

      if (!file) {

        return;

      }

 

      const formData = new FormData();

      formData.append('file', file);

 

      try {

        const response = await fetch('http://localhost:3000/api/preview-file', {

          method: 'POST',

          body: formData,

        });

 

        if (!response.ok) {

          const errorText = await response.text();

          throw new Error(`Upload failed: ${response.status} - ${errorText}`);

        }

 

        const data = await response.json();

        this.fileUrl = data.url;

        this.fileName = data.name;

 

        // Debugging: Log the URL and filename in the browser console

        console.log('File URL:', this.fileUrl);

        console.log('Filename:', this.fileName);

 

      } catch (error) {

        console.error('Error uploading file:', error);

        this.uploadError = error.message;

      }

    },

  },

};

</script>