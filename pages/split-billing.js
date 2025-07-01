import { useState } from 'react';
import styles from '../styles/splitter.module.css'; // Assuming you have default Next.js styles
import Layout from "../components/layout"

export default function HomePage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setError(null);
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

        const formData = new FormData();
        formData.append('file', file);

        try {
            // This is the connection point to your Python backend
            const response = await fetch('/api/splitter', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // Try to get a more specific error from the backend
                const errText = await response.text();
                throw new Error(errText || 'Failed to split the PDF.');
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
                </main>
            </div>
        </Layout>

    );
}