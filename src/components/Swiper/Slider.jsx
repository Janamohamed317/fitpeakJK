import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';
import { reviews } from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Slider() {
    const DisplayStars = (x) => {
        let stars = []
        for (let index = 0; index < x; index++) {
            stars.push(<FontAwesomeIcon icon={faStar} className='star-icon' color='yellow'/>)
        }
        return stars;
    }
    return (
        <div className="carousel-container">
            <h1 className="carousel-heading">Our Reviews</h1>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: true,
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination]}
                className="swiper-container"
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id} className="swiper-slide">
                        <p className='reviewr_name'>{review.name}</p>
                        <p className='review'>{review.review}</p>
                        <div className='stars'>
                            {

                                DisplayStars(review.stars)
                            }

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="swiper-pagination"></div>
        </div>
    )
}

export default Slider




