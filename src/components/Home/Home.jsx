import React from 'react';
import { imgs } from '../../assets/assets';
import home from './Home.module.css';
import Footer from '../Footer/Footer';
import Slider from '../Swiper/Slider';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function Home() {
    const navigate = useNavigate()
    const userId = useSelector((state) => state.app.userId);
    const handleNavigation = () =>
    {
        if(userId)
        {
            navigate('/Fitness-goals')
        }
        else
        {
            navigate('/signin')
        }
    }
    return (
        <>

            <Navbar />

            <div className={home.main_container}>
                <div className="row gx-0">
                    <div className="col-12 ">
                        <div className={home.hero_container}>
                            <div className={home.hero_txt_container}>
                                <h1 className={home.hero_txt}>Build <span className={home.hero_span}>Perfect Body</span> With Clean Mind</h1>
                                <button className={home.hero_btn} onClick={() => handleNavigation()}>Start Now</button>
                            </div>
                            <img src={imgs.hero2} alt="Hero fitness illustration" className={home.hero_img} />
                        </div>
                    </div>

                    <div className="col-12">
                        <div className={home.about}>
                            <h3 className={home.about_header}>About FitPeak</h3>
                            <p className={home.about_txt}>
                                Welcome to FitPeak, your ultimate fitness companion! Our mission is to help you achieve your health
                                and wellness goals by providing personalized workout plans, nutrition guidance,
                                and progress tracking—all in one easy-to-use platform. Whether you're a beginner looking to start your fitness journey
                                or an experienced athlete striving for peak performance, FitPeak is designed to support you every step of the way.
                                With expert-backed programs and a community-driven approach, we make fitness accessible, enjoyable, and effective.
                                Join us today and take the first step towards a healthier, stronger you!
                            </p>
                        </div>
                    </div>
                    <div className='col-12'>
                        <Slider />
                    </div>

                    <div className='col-12'>
                        <div className={home.key_features_container}>
                            <h3 className={home.key_features_header}>Features We Offer You</h3>
                            <ul>
                                <li className={home.guide_li}><span className={home.li_bold}>Daily Workout Logging </span>– Easily log your exercises & reps</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Goal Setting </span>– Set & track fitness milestones</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Progress Insights </span>– Visualize weight, strength, and endurance improvements</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Community Challenges </span>– Compete & stay motivated</li>
                            </ul>
                        </div>
                    </div>

                    <div className='col-12'>
                        <div className={home.hero2_container}>
                            <img src={imgs.gym} className={home.hero2_img} />
                            <h2 className={home.hero2_txt}>Your <span className={home.hero_span}>Fitness</span>, Simplified.</h2>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className={home.guide_container}>
                            <h3 className={home.guide_header}>How it Works</h3>
                            <ol>
                                <li className={home.guide_li}><span className={home.li_bold}>Create a Profile </span>– Set your fitness level & goals</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Log Workouts </span>– Track every session with ease</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Monitor Progress</span> – View stats & trends in real time</li>
                                <li className={home.guide_li}><span className={home.li_bold}>Achieve Goals</span> – Get insights & stay accountable</li>
                            </ol>
                        </div>
                    </div>
                    <div className="col-12">
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
