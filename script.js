class ImageCompressor {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.originalImage = null;
        this.compressedImage = null;
    }

    initializeElements() {
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.originalPreview = document.getElementById('originalPreview');
        this.compressedPreview = document.getElementById('compressedPreview');
        this.originalInfo = document.getElementById('originalInfo');
        this.compressedInfo = document.getElementById('compressedInfo');
        this.qualitySlider = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.downloadBtn = document.getElementById('downloadBtn');
    }

    setupEventListeners() {
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.style.borderColor = '#0071e3';
        });
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.style.borderColor = '#e5e5e7';
        });
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.style.borderColor = '#e5e5e7';
            const file = e.dataTransfer.files[0];
            if (this.isValidImage(file)) {
                this.processImage(file);
            }
        });
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (this.isValidImage(file)) {
                this.processImage(file);
            }
        });
        this.qualitySlider.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
            if (this.originalImage) {
                this.compressImage(this.originalImage);
            }
        });
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    isValidImage(file) {
        return file && ['image/jpeg', 'image/png'].includes(file.type);
    }

    processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.src = e.target.result;
            this.originalImage.onload = () => {
                this.displayOriginalImage(file);
                this.compressImage(this.originalImage);
            };
        };
        reader.readAsDataURL(file);
    }

    displayOriginalImage(file) {
        this.originalPreview.innerHTML = '';
        const img = this.originalImage.cloneNode();
        this.originalPreview.appendChild(img);
        this.originalInfo.textContent = `文件大小: ${this.formatFileSize(file.size)}`;
    }

    compressImage(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.drawImage(image, 0, 0);
        
        const quality = this.qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        this.displayCompressedImage(compressedDataUrl);
    }

    displayCompressedImage(dataUrl) {
        this.compressedPreview.innerHTML = '';
        const img = new Image();
        img.src = dataUrl;
        this.compressedPreview.appendChild(img);
        
        // 计算压缩后的文件大小
        const compressionRatio = this.calculateCompressionRatio(dataUrl);
        this.compressedInfo.textContent = `文件大小: ${this.formatFileSize(compressionRatio)}`;
        
        this.compressedImage = dataUrl;
        this.downloadBtn.disabled = false;
    }

    calculateCompressionRatio(dataUrl) {
        const base64Length = dataUrl.split(',')[1].length;
        return Math.round((base64Length * 3) / 4);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadImage() {
        if (!this.compressedImage) return;
        
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = this.compressedImage;
        link.click();
    }
}

// 初始化应用
new ImageCompressor(); 