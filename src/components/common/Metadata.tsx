import Head from 'next/head';

interface MetadataProps {
  title: string;
  description: string;
}

export function Metadata({ title, description }: MetadataProps) {

  return (
    <Head>
      <title>{title} | Fitmon</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} | Fitmon`} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
