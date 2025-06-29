import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHeart, faCamera, faUsers, faStar, faSearch, faComment, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

declare module 'gsap';
declare module 'gsap/ScrollTrigger';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: false
})
export class App implements OnInit {
  protected title = 'Usta_Visit';

  protected showPreloader = true;
  protected showChat = false;
  protected showExploreButton = false;
  protected showMain = false;

  protected currentSlide = 0;
  private carouselInterval: any;

  protected stats = { users: 0, posts: 0, comments: 0 };

  protected newsletterEmail = '';
  protected emailError = '';
  protected isEmailValid = false;

  private touchStartX = 0;
  private touchEndX = 0;

  @ViewChild('carousel') carousel!: ElementRef;

  protected faHeart = faHeart;
  protected faCamera = faCamera;
  protected faUsers = faUsers;
  protected faStar = faStar;
  protected faSearch = faSearch;
  protected faComment = faComment;
  protected faInstagram = faInstagram;
  protected faTwitter = faTwitter;
  protected faFacebook = faFacebook;
  protected faTelegram = faTelegram;
  protected faChevronUp = faChevronUp;
  protected faChevronDown = faChevronDown;

  protected chatMessages = [
    { sender: 'user1', text: 'Yo, have you checked out Ustagram yet?', avatar: 'assets/images/avatar1.png' },
    { sender: 'user2', text: 'Totally! Posting photos with Uzbek vibes is amazing.', avatar: 'assets/images/avatar2.png' },
    { sender: 'user1', text: 'The explore page is fire! So many cool posts from Tashkent.', avatar: 'assets/images/avatar1.png' },
    { sender: 'user2', text: 'Rating posts makes it so interactive!', avatar: 'assets/images/avatar2.png' },
    { sender: 'user1', text: 'Commenting and connecting is super smooth.', avatar: 'assets/images/avatar1.png' },
    { sender: 'user2', text: 'The profile customization is next-level!', avatar: 'assets/images/avatar2.png' },
    { sender: 'user1', text: 'Let’s share some posts and connect there!', avatar: 'assets/images/avatar1.png' },
    { sender: 'user2', text: 'Count me in! Ustagram’s the future!', avatar: 'assets/images/avatar2.png' }
  ];

  protected carouselSlides = [
    { image: 'assets/images/ustagram-post.png', alt: 'Ustagram Post', caption: 'Share your moments with style' },
    { image: 'assets/images/ustagram-profile.png', alt: 'Ustagram Profile', caption: 'Craft your unique identity' },
    { image: 'assets/images/ustagram-explore.png', alt: 'Ustagram Explore', caption: 'Discover trending Uzbek content' },
    { image: 'assets/images/ustagram-comment.png', alt: 'Ustagram Comment', caption: 'Engage with the community' },
    { image: 'assets/images/ustagram-rating.png', alt: 'Ustagram Rating', caption: 'Rate and highlight top posts' },
    { image: 'assets/images/ustagram-share.png', alt: 'Ustagram Share', caption: 'Spread your creativity' }
  ];

  protected features = [
    { title: 'Rating', description: 'Rate posts to highlight the best content in the community.', image: 'assets/images/rating.png', icon: faStar },
    { title: 'Exploring', description: 'Discover trending posts from Uzbekistan’s vibrant culture.', image: 'assets/images/exploring.png', icon: faSearch },
    { title: 'Posting', description: 'Share your story with stunning photos and videos.', image: 'assets/images/posting.png', icon: faCamera },
    { title: 'Commenting', description: 'Connect through meaningful comments and discussions.', image: 'assets/images/commenting.png', icon: faComment },
    { title: 'Profiling', description: 'Create a personalized Ustagram profile that shines.', image: 'assets/images/profiling.png', icon: faUsers },
    { title: 'Sharing', description: 'Share your posts across platforms with ease.', image: 'assets/images/sharing.png', icon: faHeart }
  ];

  protected faqs = [
    { question: 'What is Ustagram?', answer: 'Ustagram is a social media platform celebrating Uzbek culture, allowing users to post, rate, and comment on photos.', expanded: false },
    { question: 'How do I sign up?', answer: 'Visit ustagram.uz/signup, enter your details, and create your account in minutes.', expanded: false },
    { question: 'Is Ustagram free?', answer: 'Yes, Ustagram is free to use, with optional premium features for enhanced functionality.', expanded: false },
    { question: 'Can I use Ustagram on mobile?', answer: 'Absolutely! Download our app from ustagram.uz/app for iOS and Android.', expanded: false },
    { question: 'How do I post content?', answer: 'After signing up, click the camera icon in the app to upload photos or videos.', expanded: false },
    { question: 'Is my data safe?', answer: 'We prioritize your privacy with robust security measures to protect your data.', expanded: false },
    { question: 'How can I contact support?', answer: 'Reach out via support@ustagram.uz or through our in-app help center.', expanded: false }
  ];

  protected team = [
    { name: 'Azizbek Yuldashev', role: 'Founder & CEO', bio: 'Passionate about showcasing Uzbek culture through technology.', image: 'assets/images/team1.png' },
    { name: 'Dilshod Mirzaev', role: 'Lead Developer', bio: 'Expert in building seamless, user-friendly platforms.', image: 'assets/images/team2.png' },
    { name: 'Nargiza Karimova', role: 'Designer', bio: 'Creates stunning visuals inspired by Uzbek traditions.', image: 'assets/images/team3.png' },
    { name: 'Shokhrukhbek Usmonov', role: 'Community Manager', bio: 'Fosters vibrant connections within the Ustagram community.', image: 'assets/images/team4.png' }
  ];

  protected testimonials = [
    { text: 'Ustagram lets me share my culture in such a vibrant way!', author: 'Aziza, Tashkent' },
    { text: 'The explore page keeps me hooked with fresh content daily.', author: 'Rustam, Samarkand' },
    { text: 'Best platform for connecting with Uzbek creators!', author: 'Dilnoza, Bukhara' },
    { text: 'Posting and commenting feels so seamless and fun!', author: 'Kamron, Fergana' },
    { text: 'Ustagram’s design is stunning and easy to use!', author: 'Zarina, Namangan' }
  ];

  constructor(library: FaIconLibrary) {
    library.addIcons(faHeart, faCamera, faUsers, faStar, faSearch, faComment, faInstagram, faTwitter, faFacebook, faTelegram, faChevronUp, faChevronDown);
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.setupPreloader();
    this.setupParticles();
    this.setupFloatingButton();
    this.setupCarouselAutoPlay();
    this.setupTouchEvents();
    this.setupStatsAnimation();
    this.setupMainPageAnimations(); // Replaced setupScrollAnimations
  }

  protected setupPreloader(): void {
    gsap.from('.preloader-logo', {
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      delay: 0.5,
      ease: 'back.out(2)'
    });
    gsap.from('.preloader-title', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      delay: 1,
      ease: 'power3.out'
    });
    gsap.from('.preloader-subtitle', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      delay: 1.5,
      ease: 'power3.out'
    });
    gsap.from('.start-button', {
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      delay: 2,
      ease: 'back.out(2)',
      onComplete: () => {
      }
    });
  }

  protected setupParticles(): void {
    particlesJS('particles-js', {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 900 } },
        color: { value: ['#00d4ff', '#ff00cc', '#ffffff'] },
        shape: { type: 'circle', stroke: { width: 0 } },
        opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1.5 } },
        size: { value: 5, random: true, anim: { enable: true, speed: 2 } },
        line_linked: { enable: true, distance: 160, color: '#00d4ff', opacity: 0.4, width: 1.5 },
        move: { enable: true, speed: 4, direction: 'none', random: true, straight: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 200, line_linked: { opacity: 0.6 } }, push: { particles_nb: 5 } }
      },
      retina_detect: true
    });
  }

  protected startExperience(): void {
    gsap.to('.preloader', {
      opacity: 0,
      duration: 1.2,
      ease: 'power3.in',
      onComplete: () => {
        this.showPreloader = false;
        this.showChat = true;
        this.setupChatAnimation();
      }
    });
  }

  protected setupChatAnimation(): void {
    gsap.from('.phone-mockup', {
      opacity: 0,
      scale: 0.7,
      duration: 1.4,
      ease: 'back.out(2.5)'
    });
    gsap.from('.chat-message', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        this.showExploreButton = true;
        gsap.from('.explore-button', {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: 'back.out(2.5)'
        });
      }
    });
  }

  protected showMainPage(): void {
    gsap.to('.chat-section', {
      opacity: 0,
      duration: 1.2,
      ease: 'power3.in',
      onComplete: () => {
        this.showChat = false;
        this.showMain = true;
        this.setupMainPageAnimations();
      }
    });
  }

  protected setupMainPageAnimations(): void {
    gsap.from('.hero-section', {
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top 80%'
      }
    });

    gsap.from('.hero-cta', {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.3,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top 80%'
      }
    });

    gsap.from('.carousel-item', {
      opacity: 0,
      x: 100,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.carousel-section',
        start: 'top 80%'
      }
    });

    gsap.from('.feature-card', {
      opacity: 0,
      y: 80,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%'
      }
    });

    gsap.from('.stat-card', {
      opacity: 0,
      y: 80,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      }
    });

    gsap.from('.faq-item', {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.faq-section',
        start: 'top 80%'
      }
    });

    gsap.from('.newsletter-content', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.newsletter-section',
        start: 'top 80%'
      }
    });

    gsap.from('.team-card', {
      opacity: 0,
      y: 80,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.team-section',
        start: 'top 80%'
      }
    });

    gsap.from('.testimonial-card', {
      opacity: 0,
      y: 80,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%'
      }
    });

    gsap.from('.footer-content', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%'
      }
    });
  }

  protected setupStatsAnimation(): void {
    const animateCounter = (element: Element, target: number, duration: number) => {
      let start = 0;
      const step = target / (duration / 16);
      const update = () => {
        start += step;
        if (start >= target) {
          start = target;
        } else {
          requestAnimationFrame(update);
        }
        (element as HTMLElement).textContent = Math.floor(start).toLocaleString();
      };
      requestAnimationFrame(update);
    };

    const statsElements = document.querySelectorAll('.stat-number');
    statsElements.forEach((element: Element) => {
      const target = parseInt(element.getAttribute('data-target') || '0', 10);
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => animateCounter(element, target, 2000)
      });
    });
  }

  protected setupFloatingButton(): void {
    gsap.to('.floating-button', {
      x: 20,
      y: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      keyframes: [
        { x: 20, y: 20 },
        { x: 20, y: -20 },
        { x: -20, y: -20 },
        { x: -20, y: 20 }
      ]
    });
  }

  protected setupCarouselAutoPlay(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  protected prevSlide(): void {
    this.currentSlide = (this.currentSlide === 0) ? this.carouselSlides.length - 1 : this.currentSlide - 1;
    this.animateCarousel();
  }

  protected nextSlide(): void {
    this.currentSlide = (this.currentSlide === this.carouselSlides.length - 1) ? 0 : this.currentSlide + 1;
    this.animateCarousel();
  }

  protected animateCarousel(): void {
    gsap.to('.carousel-item', {
      opacity: 0.3,
      scale: 0.85,
      duration: 0.6,
      ease: 'power2.out'
    });
    gsap.to(`.carousel-item:nth-child(${this.currentSlide + 1})`, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  protected setupTouchEvents(): void {
    const carouselElement = this.carousel?.nativeElement;
    if (carouselElement) {
      carouselElement.addEventListener('touchstart', (e: TouchEvent) => {
        this.touchStartX = e.changedTouches[0].screenX;
      });
      carouselElement.addEventListener('touchend', (e: TouchEvent) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
    }
  }

  protected handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (swipeDistance > 50) {
      this.nextSlide();
    } else if (swipeDistance < -50) {
      this.prevSlide();
    }
  }

  protected toggleFaq(faq: { question: string; answer: string; expanded: boolean }): void {
    this.faqs.forEach(item => {
      if (item !== faq) {
        item.expanded = false;
      }
    });
    faq.expanded = !faq.expanded;
    if (faq.expanded) {
      gsap.from(`.faq-item .faq-answer`, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }

  protected validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.newsletterEmail) {
      this.emailError = 'Please enter an email address.';
      this.isEmailValid = false;
    } else if (!emailRegex.test(this.newsletterEmail)) {
      this.emailError = 'Please enter a valid email address.';
      this.isEmailValid = false;
    } else {
      this.emailError = '';
      this.isEmailValid = true;
    }
  }

  protected subscribeNewsletter(): void {
    if (this.isEmailValid) {
      console.log(`Subscribing ${this.newsletterEmail} to newsletter`);
      this.newsletterEmail = '';
      this.emailError = 'Thank you for subscribing!';
      this.isEmailValid = false;
      setTimeout(() => {
        this.emailError = '';
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
  }
}