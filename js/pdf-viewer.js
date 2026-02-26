// =========================
//  PDF VIEWER
// =========================

document.addEventListener('DOMContentLoaded', () => {

    const canvas       = document.getElementById('pdf-canvas');
    const pdfContainer = document.getElementById('pdf-container');
    const pdfFallback  = document.getElementById('pdf-fallback');


    if (!canvas || !pdfContainer || !pdfFallback) {
        return;
    }

    const url = 'pdf/Agile_Business_Methoden_Anschliesend.pdf';

    let pdfDoc   = null,
        pageNum  = 1,
        scale    = 1,
        baseScale = 1;

    const ctx = canvas.getContext('2d');

    if (typeof pdfjsLib === 'undefined') {
        showFallback();
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {

            const A4_WIDTH_PX = 650;
            const unscaledVP  = page.getViewport({ scale: 1 });
            baseScale         = A4_WIDTH_PX / unscaledVP.width;

            const viewport = page.getViewport({ scale: baseScale * scale });

            canvas.width  = viewport.width;
            canvas.height = viewport.height;

            page.render({
                canvasContext: ctx,
                viewport: viewport
            });

            document.getElementById('page-num').textContent   = num;
            document.getElementById('page-count').textContent = pdfDoc.numPages;

        }).catch(showFallback);
    }

    function showFallback() {
        pdfContainer.style.display = 'none';
        pdfFallback.style.display  = 'block';
    }

    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        pdfContainer.style.display = 'block';
        pdfFallback.style.display  = 'none';
        renderPage(pageNum);
    }).catch(showFallback);

});


// =========================
// CASE STUDY TAB SYSTEM
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll(".chois-template");

    if (!links.length) return; 

    links.forEach(link => {

        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.dataset.target;

           
            document.querySelectorAll(".content").forEach(content => {
                content.classList.remove("active");
            });

            
            links.forEach(l => l.classList.remove("active-link"));

            
            document.getElementById(targetId).classList.add("active");
            this.classList.add("active-link");
        });

    });

});