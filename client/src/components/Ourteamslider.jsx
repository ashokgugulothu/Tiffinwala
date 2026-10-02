import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
// Import the image properly relative to src or use a public URL / cloud URL
import ashokImg from './Ashokdev.jpg'; // Place Ashokdev.jpg in the same components folder

const Ourteamslider = () => {
 return (
    <div className="my-5">
     <h3 className="text-center text-3xl py-5" style={{ fontFamily: "cursive" }}>Our Team</h3>
     <Swiper 
        spaceBetween={30}
        loop={true}
        speed={900}
        autoplay={{ delay: 3500 }}
        navigation={true}
        slidesPerView={1}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
     >
        <SwiperSlide>
            <div className="flex flex-col items-center text-center">
                <img src={ashokImg} alt="Gugulothu Ashok" style={{ width: "11.4rem", height: "11.4rem", objectFit: "cover", borderRadius: "50%" }}/>
                <h4 className="mt-2 text-xl font-medium">Gugulothu Ashok</h4>
                <p>Developer</p>
                <p className="px-14 text-gray-600">Full-stack developer passionate about building scalable web applications and seamless user experiences.</p>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="flex flex-col items-center text-center">
                <img src="https://res.cloudinary.com/dvoj9zeng/image/upload/v1724695670/tiffin_iubcbg.png" alt="Anshul Parihar" style={{ width: "11.4rem", height: "11.4rem", objectFit: "cover", borderRadius: "50%" }}/>
                <h4 className="mt-2 text-xl font-medium">Anshul Parihar</h4>
                <p>Developer</p>
                <p className="px-14 text-gray-600">Co-creator of Tiffin Wala, focused on frontend architecture and intuitive UI/UX design.</p>
            </div>
        </SwiperSlide>
     </Swiper>
    </div>
 );
};

export default Ourteamslider;