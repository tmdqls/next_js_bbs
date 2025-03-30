import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold">サイト情報</h3>
            <p className="text-sm mt-2">
              ここにサイトに関する情報や説明を記載します。
            </p>
          </div>
          {}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold">連絡先</h3>
            <p className="text-sm mt-2">info@example.com</p>
            <p className="text-sm mt-2">+81 123-456-7890</p>
          </div>
        </div>
        {}
        <div className="mt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} WEB Tutorials. All Rights Reserved.
          </p>
          <p className="text-sm">
            <Link href="" className="text-blue-400 hover:text-blue-600">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="" className="text-blue-400 hover:text-blue-600">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;