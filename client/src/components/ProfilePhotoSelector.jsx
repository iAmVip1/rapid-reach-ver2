import React, { useRef, useState, useEffect } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef= useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file){
            // Clean up previous preview URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setImage(null);
        setPreviewUrl(null);
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const onChooseFile = () => {
        inputRef.current.click();
    }

  return (
    <div className='flex justify-center mb-6'>
        <input 
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
        />

        {!image ? (
            <div className="w-20 h-20 flex items-center justify-center bg-amber-200 rounded-full relative">
                <LuUser className='text-4xl ' />
                <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full absolute -bottom-1 -right-1'
                onClick={onChooseFile}
                >
                    <LuUpload />
                </button>
            </div>
        ) :(
          <div className="relative">
            <img 
              src={previewUrl}
             alt="profile pic"
              className='w-20 h-20 rounded-full object-cover border-4 border-gray-300'
              />
              <button
              type='button'
              className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 hover:bg-red-600 transition-colors'
              onClick={handleRemoveImage}
              >
                <LuTrash />
              </button>
          </div>
        )}
    </div>
  )
}

export default ProfilePhotoSelector