function TitleBar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 shadow z-30 flex items-center px-10">
      <h1 className="text-2xl font-extrabold text-indigo-600 select-none leading-tight">
        Coin<span className="text-gray-800">Traq</span>
      </h1>
    </header>
  );
}

export default TitleBar;
