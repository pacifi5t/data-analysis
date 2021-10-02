<script lang="ts">
  import { FileDropzone } from 'attractions';
  import { Series } from '../utils/series';
  import { immutableDataStore, fileStore } from '../utils/stores';

  const reader = new FileReader();
  let uplodedFiles = [];
  let immutableData = [];

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableDataStore.subscribe((value) => {
    immutableData = value;
  });
</script>

<div class="text-xl font-bold">
  <FileDropzone
    accept="text/*"
    max={1}
    files={uplodedFiles}
    on:change={(event) => {
      fileStore.set(event.detail.files);
      console.log(uplodedFiles);

      if (uplodedFiles.length != 0) {
        reader.readAsText(uplodedFiles[0]);

        reader.onload = () => {
          let str = '' + reader.result;
          let data = [];
          str.split('\n').forEach((value) => {
            data.push(Number.parseFloat(value));
          });
          immutableDataStore.set(data);
          console.log(new Series(data));
        };
      } else {
        immutableDataStore.set([]);
      }
    }}
  />
</div>

{#if immutableData.length != 0}
  <!-- TODO: Reimplement display of the data -->
  <p>{immutableData.toString()}</p>
{/if}
