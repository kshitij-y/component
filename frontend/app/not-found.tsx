import Logo from "@/components/logo";

export default function NotFound() {
  return (
      <div className="min-h-screen flex items-center justify-center flex-col text-white bg-[#212121]">
          <Logo />
      <h1 className="text-4xl font-bold mt-12">404</h1>
      <p className="text-lg mt-2 text-gray-400">
        This page could not be found.
      </p>
    </div>
  );
}
