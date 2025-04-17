document.querySelectorAll('.uploader').forEach(input => {
  input.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const container = e.target.parentElement;
    const img = container.querySelector('.resizedImage');
    const removeBtn = container.querySelector('.removeBtn');

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 100;
      ctx.drawImage(image, 0, 0, 200, 100);

      const resizedUrl = canvas.toDataURL('image/png');
      img.src = resizedUrl;
      img.style.display = 'block';
      removeBtn.style.display = 'block';
      container.classList.add('filled');
      container.dataset.imgData = resizedUrl;
    };
  });
});

document.querySelectorAll('.removeBtn').forEach(btn => {
  btn.addEventListener('click', function () {
    const block = btn.parentElement;
    block.querySelector('.uploader').value = "";
    block.querySelector('.resizedImage').style.display = 'none';
    block.classList.remove('filled');
    btn.style.display = 'none';
  });
});

document.getElementById('downloadAll').addEventListener('click', function () {
  const zip = new JSZip();
  const theme = {
    priColor: "ffff",
    secColor: "ffff",
    bgColor: "0000",
    border: 0,
    label: 1,
  };

  document.querySelectorAll('.block').forEach(block => {
    const label = block.dataset.label;
    const imgData = block.dataset.imgData;

    if (imgData) {
      theme[label] = `${label}.png`;
      const base64 = imgData.split(',')[1];
      zip.file(`${label}.png`, base64, { base64: true });
    }
  });

  zip.file("Theme.json", JSON.stringify(theme, null, 2));

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "theme.zip";
    a.click();
  });
});
