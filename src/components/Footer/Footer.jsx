import React from 'react';
import footer from './Footer.module.css';
import { useNavigate } from 'react-router-dom';
import { contact_icons, social_icons, Quick_Links } from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  const navigate = useNavigate();

  return (
    <div className={footer.main_container}>
     
      <div className='d-flex flex-column align-items-center mb-5'>
        <div className='d-flex flex-column gap-2 '>
          <span className='display-6'>FitPeak</span>
          <span className='lead'>At FitPeak, we empower you to track, improve and conquer your fitness journey.</span>
        </div>
        <hr className={footer.br_line} />

        <div className='d-flex py-4 gap-4'>
          {social_icons.map((icon) => (
            <div key={icon.id} className={footer.social_icon}>
              <FontAwesomeIcon icon={icon.icon} />
            </div>
          ))}
        </div>
      </div>

      <div className='d-flex flex-column gap-2 mb-5 '>
        <h5>Quick Links</h5>
        {Quick_Links.map((link) => (
          <div key={link.id} className={footer.quick_link}>
            <span
              className='lead'
              onClick={() => navigate(link.path)}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={link.icon} /> {link.text}
            </span>
          </div>
        ))}
      </div>

      <div className='d-flex flex-column gap-2'>
        <span className='h5'>Contact Us</span>
        {contact_icons.map((item) => (
          <div className='d-flex gap-2 align-items-center lead' key={item.id}>
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Footer;
