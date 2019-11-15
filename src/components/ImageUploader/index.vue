<template>
	<el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
        <img v-if="uploadImage" :src="uploadImage" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <label class="avatar-uploader-label" style="display:block;">项目图片</label>
    </el-upload>
</template>

<script>
	export default {
		name : "imageUploader",
		props: {
			image : {
				default : '',
				type : String
			},
		},
		data(){
			return {
				uploadImage : this.image,
			}
		}
	}
</script>