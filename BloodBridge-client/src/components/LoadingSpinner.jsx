const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0505' }}>
      <div className="w-12 h-12 rounded-full border-3 border-[rgba(214,40,40,0.2)] border-t-[#D62828] animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;