import React from "react";

export const Footer = () => {
  return (
    <div className="bg-black w-screen md:px-20">
      <div className="container mx-auto p-5 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="text-gray-400">
            <img
              className="h-20 md:h-15 mb-4"
              alt="Img"
              src="https://res.cloudinary.com/dn6anfym7/image/upload/v1698987796/dreamHome/3116f83675b9462a92edfe3a51448b4b__1_-transformed__1_-removebg_n2uh3o.png"
            />
            <p className="text-sm">
              DreamHomes is one of the best real estate websites in Kerala. You
              can buy, rent, or lease the property that you like. Being one of
              the best real estate websites in Kerala, thithithara.com is here
              to provide all the required details regarding a property. You can
              find all types of properties such as apartments for sale in
              Kerala, office spaces, house for sale, commercial land for sale,
              commercial building for sale, etc.
            </p>
          </div>

          <div className="text-gray-400">
            <div className="font-bold text-white mb-2 ">
              Popular Searches In Kerala
            </div>
            <p>Flats and Apartments for Sale in Ernakulam</p>
            <p>Flats and Apartments for Sale in Kozhikode</p>
            <p>House / Villas for sale in Ernakulam</p>
            <p>House / Villas for sale in Malappuram</p>
            <p>House / Villas for sale in Kozhikkode</p>
            <p>Houses / Villas for Sale in Thrissur</p>
          </div>
          <div className="text-gray-400">
            <div className="font-bold text-white mb-2 ">Quick links</div>
            <p>Home</p>
            <p>About Us</p>
            <p>Post Property</p>
            <p>Blog &amp; News</p>
            <p>Contact Us</p>
            <p>Other Services</p>
            <p>Post Requirement</p>
          </div>
          <div className="text-gray-400">
            <div className="font-bold text-white mb-2 ">Get in touch</div>
            <p>KINFRA Techno Industrial Park,</p>
            <p>Kakkancheri, Calicut University P.O,</p>
            <p>Malapppuram, Kerala - 673 635</p>
            <div className="flex items-center mb-2">
              <div className="text-xl mr-2">&#9742;</div>
              <div>Phone Number</div>
            </div>
            <div className="flex items-center mb-2">
              <div className="text-xl mr-2">&#9993;</div>
              <div>dreamhomes@gmail.com</div>
            </div>
            <div className="flex items-center">
              <div className="text-xl mr-2">&#xf099;</div>
              <div>Social Media Links</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-10 flex-col md:flex-row">
          <div className="text-gray-400 mb-4 md:mb-0">
            <div className="font-bold text-white mb-2">Terms of Use</div>
            <div>Privacy Policy</div>
          </div>
          <div className="text-gray-400">
            <div className="font-bold text-white mb-2">FAQ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
