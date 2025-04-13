import ProfilePicture from '@/assets/profile_dummy.jpg'
export const LocationMarker = ({ profileImageSrc }) => {
    return (
      <div className="w-16 h-16 relative">
        {/* SVG Location Pin */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M250 0C154.8 0 77.5 77.3 77.5 172.5C77.5 228.1 106.7 290.3 158.2 348.9C196.7 392.5 238.1 427 250 436.8C261.9 427 303.3 392.5 341.8 348.9C393.3 290.3 422.5 228.1 422.5 172.5C422.5 77.3 345.2 0 250 0ZM250 230C218.2 230 192.5 204.3 192.5 172.5C192.5 140.7 218.2 115 250 115C281.8 115 307.5 140.7 307.5 172.5C307.5 204.3 281.8 230 250 230Z" 
            fill="black"
          />
        </svg>
        
        {/* Profile Picture Container positioned in the center hole */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-2/5 h-2/5 rounded-full overflow-hidden" style={{ marginTop: '-25%' }}>
            <img 
              src={ProfilePicture} 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };
  