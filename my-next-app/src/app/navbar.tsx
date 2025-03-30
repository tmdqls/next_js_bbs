import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link href="/">My Logo</Link>
        </div>

        <div className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-300 transition duration-300">Home</Link>
          <Link href="/bbs/board/1" className="text-white hover:text-gray-300 transition duration-300">BBS</Link>
          <Link href="" className="text-white hover:text-gray-300 transition duration-300">SIGN IN</Link>
          <Link href="" className="text-white hover:text-gray-300 transition duration-300">SIGN UP</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;