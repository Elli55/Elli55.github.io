// pdf-viewer.js
document.addEventListener('DOMContentLoaded', () => {
    const url = 'pdf/Agile_Business_Methoden_Anschliesend.pdf';
    
    let pdfDoc = null,
        pageNum = 1,
        scale = 0.6;
    
    const canvas = document.getElementById('pdf-canvas');
    const pdfContainer = document.getElementById('pdf-container');
    const pdfFallback = document.getElementById('pdf-fallback');
    
    if (!canvas || !pdfContainer || !pdfFallback) {
        console.warn('PDF viewer elements not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    if (typeof pdfjsLib === 'undefined') {
        console.error('PDF.js library not loaded');
        showFallback();
        return;
    }
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';
    
    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            page.render(renderContext);
            
            document.getElementById('page-num').textContent = num;
            document.getElementById('page-count').textContent = pdfDoc.numPages;
        }).catch(err => {
            console.error('Page render error:', err);
            showFallback();
        });
    }
    
    function showFallback() {
        if (pdfContainer) pdfContainer.style.display = 'none';
        if (pdfFallback) pdfFallback.style.display = 'block';
    }
    
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        pdfContainer.style.display = 'block';
        pdfFallback.style.display = 'none';
        renderPage(pageNum);
    }).catch(err => {
        console.error('PDF load error:', err.message);+
        showFallback();
    });
    
    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (pageNum <= 1) return;
            pageNum--;
            renderPage(pageNum);
        });
    }
    
    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
            pageNum++;
            renderPage(pageNum);
        });
    }
    
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            scale += 0.2;
            renderPage(pageNum);
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            scale -= 0.2;
            if (scale < 0.4) scale = 0.4;
            renderPage(pageNum);
        });
    }
});

function show(id) {
    document.querySelectorAll('.content').forEach(p => {
        p.classList.remove('active');
    });
    
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('active');
    } else {
        console.warn('Element tapılmadı:', id);
    }
}