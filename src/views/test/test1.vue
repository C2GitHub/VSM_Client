<template>
  <div>
    <div>
      <div class="inputoutput">
        <img id="imageSrc" alt="No Image" />
        <div class="caption">
          imageSrc <input type="file" id="fileInput" name="file" />
        </div>
      </div>
      <div class="inputoutput">
        <canvas id="canvasOutput"></canvas>
        <div class="caption">canvasOutput</div>
      </div>
    </div>
  </div>
</template>

<script>
const cv = window.require("opencv");

export default {
  name: 'test',
  mounted() {
    let imgElement = document.getElementById("imageSrc");
    let inputElement = document.getElementById("fileInput");
    inputElement.addEventListener(
      "change",
      e => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
      },
      false
    );
    imgElement.onload = function() {
      let mat = cv.imread(imgElement);
      cv.imshow("canvasOutput", mat);
      mat.delete();
    };
  }
};
</script>

<style lang="scss" scoped></style>
