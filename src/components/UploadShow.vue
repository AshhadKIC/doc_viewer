<template>
    <div class="main-container">
      <button class="btn btn-primary">
          <a href="/">Home</a>
        </button>
      
      <div v-if="fileUrl" class="preview-container">
        <h4>Preview Url</h4>

        <VueFilesPreview :name="fileName" :url="fileUrl" />

        <p>URL: {{ fileUrl }}</p>
        <p>File Name: {{ fileName }}</p>
      </div>
        
      <div v-if="uploadFile" class="preview-container">
        <h4 class="mb-2">Preview Upload</h4>
        
        <div class="filePreview mt-4" style="max-width: 100%; border: 3px solid steelblue; padding: 1rem;">
          <VueFilesPreview :file="uploadFile" />
        </div>
      </div>

      <div v-else class="upload-btn">
        <el-upload
          ref="uploadRef"
          drag
          action="null"
          :limit="1"
          :before-upload="beforeFileUpload"
        >
          <el-icon class="el-icon--upload"></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        </el-upload>
      </div>
      <!-- <button @click="playClick">Play</button> -->

      <!-- <p>URL File Name: {{ filesName }}</p> -->

    </div>
  </template>
<script>

import { VueFilesPreview } from 'vue-files-preview';
import { ElUpload, ElIcon } from 'element-plus'
// import { getFileName } from 'vue-files-preview/lib/utils'; // Import getFileName


export default {
  components: {
    VueFilesPreview,
    ElUpload,
    ElIcon,
  },
  data() {
    return {
        uploadFile: null,
        fileName: null,
        fileUrl: null,
        // uploadRef: null
        filesName: null
    };
  },
  mounted() {
    this.pageLoad();
  },
  created() {
    // Accessing the route params
    this.filesName = this.$route.params.name;
  },
  methods: {
    beforeFileUpload(file) {
        this.uploadFile = file;
        return false;
    },
    playClick() {
      this.pageLoad();
    },
    async pageLoad(rawFile) {
        console.log("BEFORE UPLOAD");
        console.log(rawFile);
        
        // this.uploadFile = rawFile;

        // Image - Working
        // this.fileUrl = "http://localhost:3000/files/67buvcZ.jpeg";
        // this.fileName = "67buvcZ.jpeg";
        
        // pdf - Working
        // this.fileUrl = "http://localhost:3000/files/dummy.pdf";
        // this.fileName = "dummy.pdf";
        
        // Video - Error: play() failed because the user didn't interact with the document first
        // Autoplay not supported
        // this.fileUrl = "http://localhost:3000/files/ecf9OuG.mp4";
        // this.fileName = "ecf9OuG.mp4";
        
        // Audio - Working
        // this.fileUrl = "http://localhost:3000/files/file_example_MP3_700KB.mp3";
        // this.fileName = "file_example_MP3_700KB.mp3";
        
        // Word Doc - Working
        // this.fileUrl = "http://localhost:3000/files/sample-files.com-basic-text.docx";
        // this.fileName = "sample-files.com-basic-text.docx";
        
        // Excel Doc - Working, but not showing contents
        // this.fileUrl = "http://localhost:3000/files/file_example_XLS_10.xls";
        // this.fileName = "file_example_XLS_10.xls";
        
        // Powerpoint Doc - Working, but not showing contents
        // this.fileUrl = "http://localhost:3000/files/file_example_PPT_500kB.ppt";
        // this.fileName = "file_example_PPT_500kB.ppt";
        
        // Text File - Working
        // this.fileUrl = "http://localhost:3000/files/text_doc.txt";
        // this.fileName = "text_doc.txt";
        
        // README - Working
        // this.fileUrl = "http://localhost:3000/files/README.md";
        // this.fileName = "README.md";
        
        // EPUB - Working
        // this.fileUrl = "http://localhost:3000/files/sample1.epub";
        // this.fileName = "sample1.epub";

        this.fileUrl = "http://localhost:3000/files/" + this.filesName;
        this.fileName = this.filesName;

        
        try {
          const response = await fetch(this.fileUrl);
          const data = await response.blob();
          const filename = this.fileUrl.substring(this.fileUrl.lastIndexOf('/') + 1);

          this.uploadFile = new File([data], filename);
        } catch (error) {
          console.error('Error fetching or processing file:', error);
          // Handle error
        }
    },
  },
};

</script>


<style>

.filePreview img{
  max-width: 60%;
}

</style>