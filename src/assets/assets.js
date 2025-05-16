import hero2 from './hero2.jpg';
import gym from './gym.jpg';
import login from './login.png';
import UserImg from './userprofile.jpeg';

import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faChevronRight, faPhone, faEnvelope, faLocationPin } from '@fortawesome/free-solid-svg-icons';

export const imgs = {
    hero2,
    gym,
    login,
    UserImg,
};

export const reviews = [
    {
        id: 1,
        name: "Alex Churco",
        review: `A well-designed platform with an intuitive interface and seamless syncing with fitness devices. The analytics
        and goal-setting features are fantastic for tracking progress. Highly recommended for anyone serious about fitness!`,
        stars: 5
    },
    {
        id: 2,
        name: "Zack Swift",
        review: `The website offers great tracking tools for steps, calories, and heart rate, but I experienced occasional syncing delays.
        Customer support is responsive, and overall, it's a solid option for fitness tracking.`,
        stars: 4
    },
    {
        id: 3,
        name: "Zack Swift",
        review: `It does a good job with basic fitness tracking, but lacks customization for advanced users. More personalized insights and 
        workout templates would make it better. Still useful for general fitness tracking.`,
        stars: 3
    },
    {
        id: 4,
        name: "Zack Swift",
        review: `What stands out is the excellent customer support. The site is packed with useful features, from workout tracking to progress analysis. 
        A great choice for fitness enthusiasts looking for a comprehensive tool!`,
        stars: 4
    },
    {
        id: 5,
        name: "Zack Swift",
        review: `This website makes tracking fitness so easy, especially for beginners. The guided workouts and step-by-step progress 
        tracking keep me motivated.Syncs well with my smartwatch, and the dashboard is easy to understand.`,
        stars: 4
    },
];

export const social_icons = [
    {
        id: 1,
        icon: faFacebook
    },
    {
        id: 2,
        icon: faTwitter
    },
    {
        id: 3,
        icon: faInstagram
    }
];

export const contact_icons = [
    {
        id: 1,
        text: '+12516121651',
        icon: faPhone
    },
    {
        id: 2,
        text: 'Fitpeak@gmail.com',
        icon: faEnvelope
    },
    {
        id: 3,
        text: '01023456789',
        icon: faLocationPin
    }
];

export const Quick_Links = [
    {
        id: 1,
        text: 'Tips',
        icon: faChevronRight,
        path: '/Tips'
    },
    {
        id: 2,
        text: 'Home',
        icon: faChevronRight,
        path: '/'
    },
    {
        id: 3,
        text: 'Profile',
        icon: faChevronRight,
        path: '/profile'
    },

];

export const tips = [
    {
        id: 1,
        icon: '🏃‍♂️',
        title: 'Move More!',
        description: 'Walk daily to maintain heart health and improve fitness.'
    },
    {
        id: 2,
        icon: '💧',
        title: 'Stay Hydrated!',
        description: 'Drink water throughout the day to keep your body hydrated and improve performance.'
    },
    {
        id: 3,
        icon: '💤',
        title: 'Get Enough Sleep!',
        description: 'Adequate sleep boosts energy, aids muscle recovery, and improves overall health.'
    },
    {
        id: 4,
        icon: '🥗',
        title: 'Eat Healthy!',
        description: 'Include vegetables, fruits, and proteins in your diet to maintain good health.'
    },
    {
        id: 5,
        icon: '🏋️‍♀️',
        title: 'Exercise Regularly!',
        description: 'Make time for daily workouts to stay fit and strengthen your muscles.'
    }
];