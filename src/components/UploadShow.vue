<template>
    <div class="main-container">
      <!-- <button class="btn btn-primary">
          <a href="/">Home</a>
        </button> -->
      
      <div v-if="fileUrl" class="preview-container">
        <!-- <h4>Preview Url</h4> -->

        <VueFilesPreview :name="fileName" :url="fileUrl" />

        <!-- <p>URL: {{ fileUrl }}</p>
        <p>File Name: {{ fileName }}</p> -->
      </div>
        
      <div v-if="isLoading" class="loading no-print">
        <p>Loading....</p>
      </div>
      
      <div v-if="showActions" class="d-flex no-print">
        <div class="button-container d-flex ml-auto p-4" style="margin-left: auto;">
          <div class="mr-2" style="margin-right: 1rem;">
            <button class="btn btn-primary btn-sm" @click="printFile" ><i class="fa-solid fa-print"></i></button> 
          </div>
          <div>
            <button class="btn btn-secondary btn-sm " @click="downloadFile" ><i class="fa-solid fa-download"></i></button>
          </div>
        </div>
      </div>
      
      <div v-if="uploadFile" class="preview-container">
        <!-- <h4 class="mb-2">Preview Upload</h4> -->
        <div class="filePreview" id="previewSection">
          <VueFilesPreview :file="uploadFile" />
        </div>
      </div>

      <div v-if="fileError" class="file-not-found">
        <h2>File cannot be found</h2>
      </div>

      
      <!-- <button @click="playClick">Play</button> -->

      <!-- <p>URL File Name: {{ filesName }}</p> -->

    </div>
  </template>
<script>

import { VueFilesPreview } from 'vue-files-preview';
// import { ElUpload, ElIcon } from 'element-plus'
// import { getFileName } from 'vue-files-preview/lib/utils'; // Import getFileName
import axios from 'axios';

export default {
  components: {
    VueFilesPreview,
    // ElUpload,
    // ElIcon,
  },
  data() {
    return {
        uploadFile: null,
        fileName: null,
        doc_type: 'CustomerDocs',
        fileUrl: null,
        // uploadRef: null
        filesName: null,
        isLoading: true,
        fileError: false,
        showActions: false,
        imgExt: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico']
    };
  },
  mounted() {
    this.pageLoad();
  },
  created() {
    // Accessing the route params
    let fileId = this.$route.params.name;
    if(this.$route.params.doc_type) {
      this.doc_type = atob(this.$route.params.doc_type);
    }
    // check if route parm is number
    if(isNaN(fileId)) {
      // Decode base64
      try {
        this.filesName = fileId;

      } catch (error) {
        console.log(error);
        this.fileError = true;
      }
    } else {
      this.filesName = fileId;
    }
  },
  methods: {
    beforeFileUpload(file) {
        this.uploadFile = file;
        return false;
    },
    playClick() {
      this.pageLoad();
    },
    getFileType(filename) {
        const idx = filename.lastIndexOf('.')
        return filename.substring(idx + 1)
    },
    printFile() {
      // if(this.getFileType(this.fileName) == 'xlsx') {
        window.print();
        return true;
      // }
      
      // var prtContent = document.getElementById("previewSection");
      // var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=2400');
      // WinPrint.document.write(prtContent.outerHTML);
      // WinPrint.document.write(`
      //   <style>
      //     body {
      //       margin: 0;
      //       padding: 0;
      //       height: auto !important;
      //       overflow: visible !important;
      //       margin: 0;
      //       padding: 0;
      //     }
      //     img {
      //       max-width: 100%
      //     }
      //   </style>
      // `);
      
      // WinPrint.document.close();

      // Wait until content has fully loaded
      // WinPrint.onload = () => {
      //   setTimeout(() => {
      //     WinPrint.focus();
      //     WinPrint.print();
      //     WinPrint.close();
      //   }, 800); // Adjust if still cutting off
      // };
    },
    async downloadFile() {
      
      try {
        const response = await axios.get('https://kic-connect.kic.com.kw/api/v1/download', {
          params: { id: this.fileName, docType: this.doc_type},
        });

        if (response.data.success) {
          const { fileBytes, fileName, contentType } = response.data;
          const byteArray = Uint8Array.from(atob(fileBytes), char => char.charCodeAt(0));
          const blob = new Blob([byteArray], { type: contentType });
          const url = URL.createObjectURL(blob);

          // Trigger Download
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName || 'downloaded_file';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          URL.revokeObjectURL(url);
        } else {
          console.error('Error downloading file');
        }
      } catch (error) {
        console.error('Error downloading file:', error.response ? error.response.data : error);
      }
    },  
    async pageLoad() {
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
        // this.fileUrl = "http://localhost:3000/files/KIC_FORMS.docx";
        // this.fileName = "KIC_FORMS.docx";
        
        // Excel Doc - Working, but not showing contents
        // this.fileUrl = "http://localhost:3000/files/file_example_XLS_10.xlsx";
        // this.fileName = "file_example_XLS_10.xlsx";
        
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

          // Load preview by URL
          // const response = await fetch(this.fileUrl);
          // const data = await response.blob();
          // const filename = this.fileUrl.substring(this.fileUrl.lastIndexOf('/') + 1);
          
          // this.uploadFile = new File([data], filename);
          
          
          // console.log(this.fileName);
          
          
          // Load preview by api response
          const docUrl = "https://kic-connect.kic.com.kw/api/v1/download?id="+this.fileName+"&docType="+this.doc_type;
          // console.log(docUrl);
          
          const response = await axios.get(docUrl);
          const { fileBytes, fileName, contentType } = response.data;
          const byteArray = Uint8Array.from(atob(fileBytes), char => char.charCodeAt(0));
          const blob = new Blob([byteArray], { type: contentType });
          
          const data = blob;
          let filesName = fileName;
          
          // Lowercase file extension
          const [filename, extension] = filesName.split('.');
          filesName = filename + '.' + extension.toLowerCase();
          
          const fileType = this.getFileType(filesName);
          if(fileType != "pdf") {
            this.showActions = true;
          }
          
          this.uploadFile = new File([data], filesName);
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          this.fileError = true;
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

.pdf-iframe {
  height: 100vh;
  width: 100%;
}

@media print
{    
    .no-print, .no-print *
    {
        display: none !important;
        width: 0;
        height: 0;
    }
}

</style>