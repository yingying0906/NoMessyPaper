const PdfViewer = ({ pdfUrl }) => {
  return (
    <object
      className="pdf-viewer"
      style={{ height: "85vh" }}
      data={pdfUrl}
      type="application/pdf"
      width="100%"
      height="600px"
    >
      <p>
        Your web browser doesn't have a PDF plugin. Instead, you can{" "}
        <a href={pdfUrl}>click here to download the PDF file.</a>
      </p>
    </object>
  );
};

export default PdfViewer;
