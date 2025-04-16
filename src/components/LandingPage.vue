<template>
    <div class="main-container">
        <h4>Preview assets</h4>

        <div >
            <p v-for="page in pageList" :key="page.fileName">

                <router-link :to="`/files/${page.fileName}`"><span style="font-weight: bold;">{{ page.fileType }}</span> - {{ page.fileName }}</router-link>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            pageList: [
                {
                    "fileUrl": "https://i.imgur.com/67buvcZ.jpeg",
                    "fileName": "67buvcZ.jpeg",
                    "fileType": "Image"
                },
                {
                    "fileUrl": "http://localhost:3000/files/dummy.pdf",
                    "fileName": "dummy.pdf",
                    "fileType": "PDF"
                },
                {
                    "fileUrl": "https://i.imgur.com/ecf9OuG.mp4",
                    "fileName": "ecf9OuG.mp4",
                    "fileType": "Video"
                },
                {
                    "fileUrl": "http://localhost:3000/files/file_example_MP3_700KB.mp3",
                    "fileName": "file_example_MP3_700KB.mp3",
                    "fileType": "Audio"
                },
                {
                    "fileUrl": "http://localhost:3000/files/sample-files.com-basic-text.docx",
                    "fileName": "sample-files.com-basic-text.docx",
                    "fileType": "Word File"
                },
                {
                    "fileUrl": "http://localhost:3000/files/file_example_XLS_10.xls",
                    "fileName": "file_example_XLS_10.xls",
                    "fileType": "Excel File"
                },
                {
                    "fileUrl": "http://localhost:3000/files/file_example_PPT_500kB.ppt",
                    "fileName": "file_example_PPT_500kB.ppt",
                    "fileType": "Powerpoint File"
                },
                {
                    "fileUrl": "http://localhost:3000/files/text_doc.txt",
                    "fileName": "text_doc.txt",
                    "fileType": "Text File"
                },
                {
                    "fileUrl": "http://localhost:3000/files/README.md",
                    "fileName": "README.md",
                    "fileType": "README File"
                },
                {
                    "fileUrl": "http://localhost:3000/files/sample1.epub",
                    "fileName": "sample1.epub",
                    "fileType": "EPUB File"
                }
            ]
        }
    }
}
</script>