import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // 데이터를 가져오거나 조건을 체크해서 404로 리디렉션
    const dataExists = false; // 예시 조건: 데이터가 존재하지 않음
    if (!dataExists) {
      router.push('/404');
    }
  }, [id, router]);

};

export default DynamicPage;
