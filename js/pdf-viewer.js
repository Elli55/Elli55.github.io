document.addEventListener('DOMContentLoaded', function () {

    const url = 'pdf/Agile_Business_Methoden_Anschliesend.pdf';

    const canvas = document.getElementById('pdf-canvas');
    const pdfContainer = document.getElementById('pdf-container');
    const pdfFallback = document.getElementById('pdf-fallback');

    if (!canvas || !pdfContainer || !pdfFallback) return;

    const ctx = canvas.getContext('2d');

    let pdfDoc = null;
    let pageNum = 1;
    let scale = 1;
    let baseScale = 1;

    function showFallback() {
        pdfContainer.style.display = 'none';
        pdfFallback.style.display = 'block';
    }

    function renderPage(num) {
        pdfDoc.getPage(num).then(function (page) {

            const A4_WIDTH_PX = 650;
            const unscaledVP = page.getViewport({ scale: 1 });
            baseScale = A4_WIDTH_PX / unscaledVP.width;

            const viewport = page.getViewport({ scale: baseScale * scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({
                canvasContext: ctx,
                viewport: viewport
            });

            document.getElementById('page-num').textContent = num;
            document.getElementById('page-count').textContent = pdfDoc.numPages;

        }).catch(showFallback);
    }

    if (typeof pdfjsLib === 'undefined') {
        showFallback();
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

    pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdfDoc = pdf;
        pdfContainer.style.display = 'block';
        pdfFallback.style.display = 'none';
        renderPage(pageNum);
    }).catch(showFallback);

    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            if (pageNum <= 1) return;
            pageNum--;
            renderPage(pageNum);
        });
    }

    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
            pageNum++;
            renderPage(pageNum);
        });
    }

    const zoomInBtn = document.getElementById('zoom-in');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function () {
            scale += 0.2;
            renderPage(pageNum);
        });
    }

    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function () {
            scale -= 0.2;
            if (scale < 0.4) scale = 0.4;
            renderPage(pageNum);
        });
    }

});





