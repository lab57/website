import { useState } from 'react';
import styles from '../styles/splitter.module.css'; // Assuming you have default Next.js styles
import Layout from "../components/layout"

export default function HomePage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    // New state to hold the list of client names found
    const [foundClients, setFoundClients] = useState([]);

    const handleFileChange = (e) => {
        setError(null);
        setFoundClients([]); // Reset clients list on new file selection
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setError(null);
        setFoundClients([]); // Reset clients list before new submission

        const formData = new FormData();
        formData.append('file', file);

        try {
            // This is the connection point to your Python backend
            const response = await fetch('/api/splitter', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to split the PDF.');
            }

            // Read the custom header containing client names
            const clientNamesHeader = response.headers.get('X-Client-Names');
            if (clientNamesHeader) {
                // Decode the names and split them into an array
                const decodedNames = clientNamesHeader.split(',').map(name => decodeURIComponent(name));
                setFoundClients(decodedNames);
            }

            // Handle the successful download of the zip file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `split_${file.name.replace('.pdf', '.zip')}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            setError(err.message);
            setFoundClients([]); // Clear clients on error
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <main className={styles.main}>
                    <div>
                        <h1 className={styles.title}>
                            📄 PDF Statement Splitter
                        </h1>
                        <p className={styles.description}>
                            Upload a single PDF to split it into separate files for each client.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <button type="submit" disabled={uploading || !file}>
                            {uploading ? 'Processing...' : 'Upload and Split'}
                        </button>
                    </form>

                    {error && <p className={styles.error}>{error}</p>}

                    {/* New section to display the list of found clients */}
                    {foundClients.length > 0 && (
                        <div className={styles.results}>
                            <h3>Successfully Processed {foundClients.length} Clients:</h3>
                            <ul>
                                {foundClients.map((name, index) => (
                                    <li key={index}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
