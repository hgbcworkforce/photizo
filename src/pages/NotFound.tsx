export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand-red/10 blur-3xl rounded-full pointer-events-none" />
        <h1 
          className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange tracking-tight select-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          404
        </h1>
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900 mb-8 tracking-tight">
        Page Not Found
      </p>
      <a 
        href="/" 
        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        Go Back Home
      </a>
    </div>
  );
}