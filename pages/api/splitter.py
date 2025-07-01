from http.server import BaseHTTPRequestHandler
from werkzeug.datastructures import FileStorage
from werkzeug.formparser import parse_form_data
import io
import zipfile
import re
import pymupdf  # PyMuPDF


# --- Your PDF Splitting Logic ---
# This is the same core logic, but now as a standard Python function.
def create_split_pdfs(pdf_stream):
    output_files = []
    client_pattern = re.compile(r"Client:\s*(.+)")
    date_pattern = re.compile(r"Date:\s*(\d{2})/\d{2}/(\d{4})")
    month_map = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
    }

    try:
        source_doc = pymupdf.open(stream=pdf_stream, filetype="pdf")
    except Exception:
        return []

    client_pages = []
    # ... (The logic to find client_pages is identical to the previous script) ...
    for page_num, page in enumerate(source_doc):
        text = page.get_text("text")
        client_match = client_pattern.search(text)

        if client_match:
            full_name = client_match.group(1).strip()
            last_name = full_name.split()[-1] if full_name.split() else ""
            safe_name = re.sub(r'[\t\n\r\f\v\\/*?:"<>|]', "", last_name).strip()

            month_name, year = "UnknownMonth", "UnknownYear"
            date_match = date_pattern.search(text)
            if date_match:
                month_num, year = date_match.group(1), date_match.group(2)
                month_name = month_map.get(month_num, "UnknownMonth")

            client_pages.append(
                {
                    "name": safe_name,
                    "start_page": page_num,
                    "month": month_name,
                    "year": year,
                }
            )

    if not client_pages:
        return []

    for i, client in enumerate(client_pages):
        start_page = client["start_page"]
        end_page = (
            (client_pages[i + 1]["start_page"] - 1)
            if (i + 1 < len(client_pages))
            else (source_doc.page_count - 1)
        )

        client_doc = pymupdf.open()
        client_doc.insert_pdf(source_doc, from_page=start_page, to_page=end_page)

        pdf_bytes = client_doc.write()
        client_doc.close()

        filename = f"{client['name']}{client['month']}{client['year']}.pdf"
        output_files.append({"name": filename, "data": pdf_bytes})

    return output_files


# --- The Vercel Serverless Handler ---
class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # 1. Parse the uploaded file from the form data
        environ = {
            "REQUEST_METHOD": "POST",
            "CONTENT_TYPE": self.headers["Content-Type"],
            "CONTENT_LENGTH": self.headers["Content-Length"],
        }
        _, form, files = parse_form_data(environ, self.rfile)
        uploaded_file = files.get("file")

        if not isinstance(uploaded_file, FileStorage):
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"No file uploaded.")
            return

        # 2. Call the processing function with the file stream
        split_pdfs = create_split_pdfs(uploaded_file.stream)

        if not split_pdfs:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Could not find client statements in PDF.")
            return

        # 3. Create a zip file in memory
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
            for pdf in split_pdfs:
                zf.writestr(pdf["name"], pdf["data"])
        memory_file.seek(0)

        # 4. Send the successful response with the zip file
        self.send_response(200)
        self.send_header("Content-Type", "application/zip")
        self.send_header(
            "Content-Disposition", 'attachment; filename="split_results.zip"'
        )
        self.end_headers()
        self.wfile.write(memory_file.getvalue())
        return
