import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 로고 */}
        <div className="text-white font-bold text-2xl">
          <Link href="/">My Logo</Link>
        </div>

        {/* 메뉴 항목 */}
        <div className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-300 transition duration-300">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-300 transition duration-300">About</Link>
          <Link href="/services" className="text-white hover:text-gray-300 transition duration-300">Services</Link>
          <Link href="/contact" className="text-white hover:text-gray-300 transition duration-300">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;