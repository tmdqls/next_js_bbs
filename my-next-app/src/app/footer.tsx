import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          {/* 사이트 정보 */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold">サイト情報</h3>
            <p className="text-sm mt-2">
              ここにサイトに関する情報や説明を記載します。
            </p>
          </div>

          {/* 연락처 */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold">連絡先</h3>
            <p className="text-sm mt-2">info@example.com</p>
            <p className="text-sm mt-2">+81 123-456-7890</p>
          </div>
        </div>

        {/* 푸터 하단 링크 */}
        <div className="mt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} WEB Tutorials. All Rights Reserved.
          </p>
          <p className="text-sm">
            <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-600">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-600">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;