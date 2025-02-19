const SkeletonLoader = ({ className }) => {
    return (
      <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
    );
  };
  
  export default SkeletonLoader;