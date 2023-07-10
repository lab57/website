import Link from 'next/link';
import Image from 'next/image'
import Layout from "../components/layout"
const Component = () => {
    return (<Image
        src="/images/profile.jpg"
        height={144}
        width={144}
        alt="name"
    />);
}

export default function FirstPost() {
    return (
        <Layout>
            <h1>First Post</h1>
            <h2>
                <Link href="/">Back to home</Link>
            </h2>
            <Component />
        </Layout>
    );
}