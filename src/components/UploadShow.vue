<template>
    <div class="main-container">
      <div v-if="fileUrl" class="preview-container">
        <VueFilesPreview :name="fileName" :url="fileUrl" />
      </div>
        
      <div v-if="isLoading" class="loading no-print pt-4">
        <h3>Loading....</h3>
      </div>
      <div v-if="showUnauthorized && isApprovedDocs" class="no-print pt-4">
        <h3>You are not authorized to access this</h3>
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
        <div class="filePreview" id="previewSection">
          <VueFilesPreview :file="uploadFile" />
        </div>
      </div>
      <div v-if="fileError" class="file-not-found">
        <h2>File cannot be found</h2>
      </div>
    </div>
  </template>
<script>

import { VueFilesPreview } from 'vue-files-preview';
import axios from 'axios';

export default {
  components: {
    VueFilesPreview,
  },
  data() {
    return {
        uploadFile: null,
        fileName: null,
        doc_type: 'CustomerDocs',
        fileUrl: null,
        filesName: null,
        isLoading: true,
        showUnauthorized: false,
        fileError: false,
        showActions: false,
        imgExt: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico'],
        auth: null,
    };
  },
  mounted() {
    
    this.isLoading = true;

    // Start a timer to see if auth was sent
    setTimeout(() => {
      // console.log('TIMEOUT');
      // this.pageLoad();
      
      // If auth was not sent show unauthorized without waiting
      if(!this.isApprovedDocs) {
        if(!this.auth) {
          console.log("auth was not sent");
          this.isLoading = false;
          this.showUnauthorized = true;
        } else {
          console.log("auth received");
          this.isLoading = false;
          this.showUnauthorized = false;
        }
      }
    }, 3000);
    

    // Listen for the authentication token that will be sent from app trying to use the viewer
    window.addEventListener("message", (event) => {
      // console.log("event-listener-message", event);
      console.log("t", event.data.token);

      // Allow only parent origin
      // if (event.origin !== "http://localhost:8081") return;
      
      // skip current domain  
      if (event.origin == window.location.origin) return;

      const { token } = event.data;
      this.auth = token;
      this.pageLoad();

    });

    if(this.isApprovedDocs)
      this.pageLoad();

    
    // console.log(window.parent);
    
    window.parent.postMessage("ready-from-iframe", "*");

  },
  created() {
    // Accessing the route params
    let fileId = this.$route.params.name;
    if(this.$route.params.doc_type) {
      if(isNaN(this.$route.params.doc_type)){
        this.doc_type = atob(this.$route.params.doc_type)
      } else {
        this.doc_type = this.$route.params.doc_type;
      }
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
  computed: {
    isApprovedDocs() {
      //approved docs loaded from docuware
      return window.location.href.includes('approved-files');
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
        window.print();
        return true;
    },
    async downloadFile() {
      
      try {
        // Load preview by URL
          
          const [apiUrl, configs] = this.getConfigs(this.fileName, this.doc_type);
          console.log(apiUrl)
          const response = await axios.get(apiUrl, configs);
          
          // const response = await axios.get(`https://kic-connect.kic.com.kw/api/v1/download/${this.fileName}/${this.doc_type}`);
          if (response.data) {
            // const { fileBytes, fileName, contentType } = response.data;
            // Create a blob directly from response
            const blob = response.data;
            let fileName;
            if(this.isApprovedDocs) {
              fileName = response.headers['content-filename'];
            } else {
              fileName = `Doc_${this.fileName}.pdf`;
            }

            
          // const byteArray = Uint8Array.from(atob(fileBytes), char => char.charCodeAt(0));
          // const blob = new Blob([byteArray], { type: contentType });
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

        // this.fileUrl = "http://localhost:3000/files/" + this.filesName;
        this.fileName = this.filesName;
        try {

          // Load preview by URL
          const [apiUrl, configs] = this.getConfigs(this.fileName, this.doc_type);
          console.log(apiUrl)
          
          const response = await axios.get(apiUrl, configs);
 
          // Create a blob directly from response
          const blob = response.data;
          let fileName;
          if(!this.isApprovedDocs) {
            fileName = response.headers['content-filename'];
            // Lowercase file extension
            const lastDotIndex = fileName.lastIndexOf('.');
            const filename_only = lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
            const extension = lastDotIndex === -1 ? '' : fileName.slice(lastDotIndex + 1);
            fileName = filename_only + '.' + extension.toLowerCase();
            
          } else {
            // Docuware will only have .pdfs
            fileName = `Doc_${this.fileName}.pdf`;
          }

          this.uploadFile = new File([blob], fileName);
          let filesName = fileName;
          
          const fileType = this.getFileType(filesName);
          if(fileType != "pdf") {
            this.showActions = true;
          }
          
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          this.fileError = true;
          console.error('Error fetching or processing file:', error);
          // Handle error
        }
    },

    getConfigs(fileName, doc_type) {
      let configs;
      let apiUrl;
      if(this.isApprovedDocs) {
        // Load From Docuware 
        apiUrl = `${process.env.VUE_APP_DOCUWARE_API_BASE_URL}/Documents/${atob(fileName)}/download`;
        configs = {
          responseType: 'blob',
          headers: {
            "Content-Type": "multipart/form-data",
            'X-App-Name': 'KIC-DWMS',
            'X-Api-Key': 'KIC_Unique_Secret_Key_456def',
            'X-Requester': 'CORP_LIFECYCLE',
          }
        }
      } else {
        // Load from KIC Connect
        apiUrl = `${process.env.VUE_APP_API_BASE_URL}/download?id=${fileName}&docType=${doc_type}`;
        configs = {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${this.auth}`
          }
        }
      }

      return [
        apiUrl,
        configs
      ];
    }
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