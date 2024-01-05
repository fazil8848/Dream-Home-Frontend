import React, { useState } from 'react'
import { Carousel } from "@material-tailwind/react";

const PropertyImageCarousal = ({ImageUrls}) => {
  const [selectedImage, setSelectedImage] =useState(null);
  const closeModal = ()=> setSelectedImage(null);
  return (
    <>
      <Carousel transition={{ duration: 1.5 }} className="rounded-md ">
          {ImageUrls.map((url, index) => {
            return (
              <img
              key={index}
                src={url}
                alt={`image ${index + 1}`}
                className=" h-full w-full object-cover"
                onClick={()=>setSelectedImage(url)}
              />
            );
          })}
        </Carousel>

        {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <img src={selectedImage} alt="Selected" className="max-h-[87vh]" />
        </div>
      )}
      
    </>
  )
}

export default PropertyImageCarousal
