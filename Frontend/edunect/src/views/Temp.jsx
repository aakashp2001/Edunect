import React from 'react';
import pdfFile from './TOC_Practice Book_2024.pdf'
const PdfViewer = () => {
    return (
        <div className="pdf-viewer">
            <p>hello</p>

            <div class="m-2 space-y-2">

                <div
                    class="group flex flex-col gap-2 rounded-lg p-5 border border-black"
                    tabindex="2"
                >
                    <div class="flex cursor-pointer items-center justify-between">
                        <span> Time Table </span>
                        <i
                            class="h-2 w-3 transition-all duration-500 group-focus:-rotate-180 bi bi-chevron-down" alt="Drop Down icon"
                        />
                    </div>
                    <div
                        class="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
                    >
                        <object style={{ width: "100%" }}
                            data={pdfFile}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                        >
                            <p>Your browser does not support PDFs. <a href={pdfFile}>Download the PDF</a>.</p>
                        </object>
                    </div>
                </div>

                <div
                    class="group flex flex-col gap-2 rounded-lg p-5 border border-black"
                    tabindex="2"
                >
                    <div class="flex cursor-pointer items-center justify-between">
                        <span> Time Table </span>
                        <i
                            class="h-2 w-3 transition-all duration-500 group-focus:-rotate-180 bi bi-chevron-down" alt="Drop Down icon"
                        />
                    </div>
                    <div
                        class="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
                    >
                        <object style={{ width: "100%" }}
                            data={pdfFile}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                        >
                            <p>Your browser does not support PDFs. <a href={pdfFile}>Download the PDF</a>.</p>
                        </object>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfViewer;