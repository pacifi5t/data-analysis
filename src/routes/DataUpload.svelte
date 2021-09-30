<script lang="ts">
  import { FileDropzone } from 'attractions';
  
  let files = [];
</script>

<div class="text-xl font-bold">
  <FileDropzone accept="text/*" {files} max={1} />
</div>
