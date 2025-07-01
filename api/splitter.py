from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import zipfile
import re
import pymupdf

# Create the Flask app
app = Flask(__name__)

# This single line handles all CORS issues (like 405 errors) automatically
CORS(app)


# The PDF splitting logic (no changes needed here)
def create_split_pdfs(pdf_stream):
    # ... your existing create_split_pdfs function ...
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


# The API Endpoint
@app.route("/", methods=["POST"])
def handle_split_request():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    split_pdfs = create_split_pdfs(file.stream)

    if not split_pdfs:
        return jsonify({"error": "Could not find client statements"}), 400

    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
        for pdf in split_pdfs:
            zf.writestr(pdf["name"], pdf["data"])
    memory_file.seek(0)

    # Use Flask's send_file to create the response
    return send_file(
        memory_file,
        download_name="split_results.zip",
        mimetype="application/zip",
        as_attachment=True,
    )
