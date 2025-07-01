from http.server import BaseHTTPRequestHandler
import cgi
import pymupdf  # Fitz
import os
import re
import zipfile
import io
import shutil

# A dictionary to convert month number to its name
MONTH_MAP = {
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


def split_billing_pdf(source_pdf_bytes, output_folder):
    """
    Splits a PDF of billing statements into separate files for each client.

    The function reads a PDF from bytes, finds client names and dates to create
    filenames like "LastnameMonthYear.pdf", saves them to the output_folder,
    and returns a list of the created file paths.
    """
    # Create the output directory if it doesn't exist.
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Compile regex patterns for finding client and date information.
    client_pattern = re.compile(r"Client:\s*(.+)")
    date_pattern = re.compile(r"Date:\s*(\d{2})/\d{2}/(\d{4})")

    client_pages = []
    created_files = []

    try:
        # Open the PDF directly from the byte stream passed to the function.
        source_doc = pymupdf.open("pdf", source_pdf_bytes)
    except Exception as e:
        # Handle exceptions during PDF opening.
        print(f"Error opening PDF from bytes: {e}")
        raise ValueError(
            f"Could not open the provided PDF file. It may be corrupt or not a valid PDF. Error: {e}"
        )

    # Scan each page for client statements.
    for page_num, page in enumerate(source_doc):
        text = page.get_text("text")
        client_match = client_pattern.search(text)

        # If a client name is found, extract details.
        if client_match:
            full_name = client_match.group(1).strip()
            # Sanitize the name for the filename.
            last_name = full_name.split()[-1]
            safe_name = re.sub(r'[\t\n\r\f\v\\/*?:"<>|]', "", last_name).strip()

            month_name, year = "UnknownMonth", "UnknownYear"
            date_match = date_pattern.search(text)
            if date_match:
                month_num, year = date_match.group(1), date_match.group(2)
                month_name = MONTH_MAP.get(month_num, "UnknownMonth")

            client_pages.append(
                {
                    "name": safe_name,
                    "start_page": page_num,
                    "month": month_name,
                    "year": year,
                }
            )

    if not client_pages:
        raise ValueError(
            "No client statements found. Ensure the PDF contains 'Client: <Name>' on statement pages."
        )

    # Split the PDF into individual files based on the found client data.
    for i, client in enumerate(client_pages):
        start_page = client["start_page"]
        # Determine the end page for the current client's statement.
        end_page = (
            (client_pages[i + 1]["start_page"] - 1)
            if (i + 1 < len(client_pages))
            else (source_doc.page_count - 1)
        )

        # Create a new PDF document for the individual client.
        client_doc = pymupdf.open()
        client_doc.insert_pdf(source_doc, from_page=start_page, to_page=end_page)

        # Construct the filename and path.
        output_filename = f"{client['name']}{client['month']}{client['year']}.pdf"
        output_path = os.path.join(output_folder, output_filename)

        # Save the new PDF and add its path to our list.
        client_doc.save(output_path)
        client_doc.close()
        created_files.append(output_path)

    source_doc.close()
    return created_files


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Vercel provides a /tmp directory for temporary file storage.
        # We create a unique subdirectory for each request to avoid conflicts.
        temp_dir = "/tmp/pdf_splitter_output"
        # Clean up any old directories first.
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        os.makedirs(temp_dir)

        try:
            # Parse the multipart form data to get the uploaded file.
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": self.headers["Content-Type"],
                },
            )

            # Check if the 'file' field is in the form.
            if "file" not in form:
                self.send_error(
                    400, "No file uploaded. Please include a file in the 'file' field."
                )
                return

            file_item = form["file"]
            if not file_item.filename:
                self.send_error(400, "No file selected.")
                return

            # Read the content of the uploaded PDF file.
            pdf_bytes = file_item.file.read()

            # Call the main function to split the PDF. It will raise an error if something goes wrong.
            split_files = split_billing_pdf(pdf_bytes, temp_dir)

            # Create a zip archive in memory.
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for file_path in split_files:
                    # Add each split PDF to the zip archive.
                    zip_file.write(file_path, os.path.basename(file_path))

            # Move the buffer's cursor to the beginning.
            zip_buffer.seek(0)
            zip_data = zip_buffer.read()

            # Send the success response and headers for the zip file download.
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header(
                "Content-Disposition", f'attachment; filename="split_files.zip"'
            )
            self.send_header("Content-Length", str(len(zip_data)))
            self.end_headers()

            # Write the zip file data to the response body.
            self.wfile.write(zip_data)

        except ValueError as e:
            # Handle specific errors from our PDF processing logic.
            self.send_error(400, str(e))
        except Exception as e:
            # Handle other unexpected errors.
            print(f"An unexpected error occurred: {e}")
            self.send_error(500, f"An internal server error occurred: {e}")
        finally:
            # Crucially, clean up the temporary directory and its contents.
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)

        return
