import dynamic from 'next/dynamic';
import HeaderComponent from '../components/header/Header';
import Description from '@/components/description/Description';
import { PageWrapper } from '@/styles/AppStyles';

const QuillEditor = dynamic(() => import('../components/quill-editor/QuillEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Home() {
  return (
    <PageWrapper>
      <HeaderComponent />
      <Description />
      <QuillEditor />
    </PageWrapper>
  )
}
