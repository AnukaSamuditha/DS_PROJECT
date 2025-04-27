const Timeline = () => {
    return (
      <div className="flex flex-col items-start  p-4">
        
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <div>
            <p className="text-gray-400 text-sm">Rider</p>
            <p className="font-semibold text-gray-800">New York, NY</p>
          </div>
        </div>
  
        <div className="ml-2 border-l-2 border-gray-300 h-10"></div>
  
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-black rounded-full"></div>
          <div>
            <p className="text-gray-400 text-sm">Shop</p>
            <p className="font-semibold text-gray-800">Los Angeles, CA</p>
          </div>
        </div>

        <div className="ml-2 border-l-2 border-gray-300 h-10"></div>
  
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <div>
            <p className="text-gray-400 text-sm">Destination</p>
            <p className="font-semibold text-gray-800">Los Angeles, CA</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Timeline;
  