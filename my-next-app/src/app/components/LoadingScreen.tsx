import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white/60 z-[9999] flex items-center justify-center">
      <Image
        src="/isloading.gif"
        alt="Loading..."
        width={100}
        height={100}
      />
    </div>
  );
};

export default LoadingScreen;