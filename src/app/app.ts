import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHeart, faCamera, faUsers, faStar, faSearch, faComment, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: false,
  animations: [  trigger('messageAnimation', [    state('hidden', style({ opacity: 0, transform: 'translateY(30px)' })),    state('visible', style({ opacity: 1, transform: 'translateY(0)' })),    state('exit', style({ opacity: 0, transform: 'translateY(-100%)' })),    transition('hidden => visible', animate('0.7s ease-in')),    transition('visible => exit', animate('0.5s ease-out'))  ])]
})
export class App implements OnInit {
  protected title = 'Usta_Visit';

  protected showPreloader = true;
  protected showChat = false;
  protected showExploreButton = false;
  protected showMain = false;
  protected showTyping = false;

  protected currentSlide = 0;
  private carouselInterval: any;

  protected stats = { users: 0, posts: 0, comments: 0 };

  protected newsletterEmail = '';
  protected emailError = '';
  protected isEmailValid = false;

  private touchStartX = 0;
  private touchEndX = 0;
  private currentMessageIndex = 0;

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
    { sender: 'user1', text: 'Hey, Ustagram haqida eshitdingmi?', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', state: 'hidden' },
    { sender: 'user2', text: 'Ha, zo‘r platforma ekan! Hunarmandchilikni zamonaviy darajaga chiqaradi. 🇺🇿', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12', state: 'hidden' },
    { sender: 'user1', text: 'Men o‘z ishlarimni katta auditoriyaga tekinga reklama qildim', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', state: 'hidden' },
    { sender: 'user2', text: 'Men esa umumiy reyting orqali o‘zimga kerakli mutaxassis topdim', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12', state: 'hidden' },
    { sender: 'user1', text: 'Shaxsiy kabinetni sozlab, musobaqalashish boshqa daraja 🔥', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', state: 'hidden' },
    { sender: 'user2', text: '🫵 Siz ham quyidagi tugmani bosib, bizga qo‘shiling', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12', state: 'hidden' }
  ];

  protected carouselSlides = [
    { image: 'new.jpg', alt: 'Ustagram Post', caption: 'Hunarmandchilikka oid yangiliklar, fikrlar va noodatiy lavhalar' },
    { image: 'rate.jpg', alt: 'Ustagram Profil', caption: 'Universal qidiruv va mutaxassislar reytingi' },
    { image: 'profile.jpeg', alt: 'Ustagram Kashf', caption: 'Resume sifatida shaxsiy kabinet' }
  ];

  protected features = [
    { title: 'Baholash', description: 'Jamoada eng yaxshi kontentni ajratib ko‘rsatish uchun postlarni baholang.', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', icon: faStar },
    { title: 'Kashf qilish', description: 'O‘zbekistonning jonli madaniyatidan trend postlarni kashf qiling.', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', icon: faSearch },
    { title: 'Post qilish', description: 'Ajoyib fotosuratlar va videolar bilan o‘z hikoyangizni ulashing.', image: 'https://images.unsplash.com/photo-1516321310768-79db8ce2d971', icon: faCamera },
    { title: 'Fikr yozish', description: 'Fikrlar va muhokamalar orqali bog‘laning.', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', icon: faComment },
    { title: 'Profil yaratish', description: 'Yorqin Ustagram profilini yarating.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2b6e3c', icon: faUsers },
    { title: 'Ulashish', description: 'Postlaringizni boshqa platformalarda oson ulashing.', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', icon: faHeart }
  ];

  protected faqs = [
    { question: 'Ustagram nima?', answer: 'Ustagram - O‘zbek madaniyatini nishonlaydigan ijtimoiy media platformasi, fotosuratlarni joylash, baholash va fikr bildirish imkonini beradi.', expanded: false },
    { question: 'Qanday ro‘yxatdan o‘tsam bo‘ladi?', answer: 'ustagram.uz/signup ga kiring, ma’lumotlaringizni kiriting va bir necha daqiqada hisob yarating.', expanded: false },
    { question: 'Ustagram bepulmi?', answer: 'Ha, Ustagram bepul, qo‘shimcha funksiyalar uchun ixtiyoriy premium imkoniyatlar bor.', expanded: false },
    { question: 'Ustagramni telefonda ishlatsam bo‘ladimi?', answer: 'Albatta! iOS va Android uchun ustagram.uz/app dan ilovamizni yuklab oling.', expanded: false },
    { question: 'Kontentni qanday joylasam bo‘ladi?', answer: 'Ro‘yxatdan o‘tgach, ilovada kamera belgisini bosing va fotosurat yoki video yuklang.', expanded: false },
    { question: 'Ma’lumotlarim xavfsizmi?', answer: 'Ma’lumotlaringizni himoya qilish uchun kuchli xavfsizlik choralarini qo‘llaymiz.', expanded: false },
    { question: 'Qo‘llab-quvvatlash bilan qanday bog‘lansam bo‘ladi?', answer: 'support@ustagram.uz orqali yoki ilovadagi yordam markazi orqali bog‘laning.', expanded: false }
  ];

  protected team = [
    { name: 'Azizbek Yuldashev', role: 'Asoschi va Direktor', bio: 'Texnologiya orqali O‘zbek madaniyatini namoyish qilishga ishtiyoqli.', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Dilshod Mirzaev', role: 'Bosh Dasturchi', bio: 'Foydalanuvchilar uchun qulay platformalar yaratishda mutaxassis.', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12' },
    { name: 'Nargiza Karimova', role: 'Dizayner', bio: 'O‘zbek an’analaridan ilhomlangan ajoyib vizuallar yaratadi.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
    { name: 'Shokhrukhbek Usmonov', role: 'Jamoa Menejeri', bio: 'Ustagram jamoasida jonli aloqalarni rivojlantiradi.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' }
  ];

  protected testimonials = [
    { text: 'Ustagram orqali madaniyatimizni juda jonli tarzda ulashaman!', author: 'Aziza, Toshkent' },
    { text: 'Kashf qilish sahifasi har kuni yangi kontent bilan meni o‘ziga jalb qiladi.', author: 'Rustam, Samarqand' },
    { text: 'O‘zbek ijodkorlari bilan bog‘lanish uchun eng yaxshi platforma!', author: 'Dilnoza, Buxoro' },
    { text: 'Post qilish va fikr yozish juda qulay va qiziqarli!', author: 'Kamron, Farg‘ona' },
    { text: 'Ustagramning dizayni ajoyib va foydalanish oson!', author: 'Zarina, Namangan' }
  ];

  constructor(library: FaIconLibrary, private ngZone: NgZone) {
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
    this.setupMainPageAnimations();
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
      ease: 'back.out(2)'
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
    this.animateMessages();
  }

  protected animateMessages(): void {
    this.ngZone.run(() => {
      if (this.currentMessageIndex < this.chatMessages.length) {
        this.showTyping = true;
        setTimeout(() => {
          this.ngZone.run(() => {
            this.chatMessages[this.currentMessageIndex].state = 'visible';
            this.showTyping = false;
            this.currentMessageIndex++;
            if (this.currentMessageIndex < this.chatMessages.length) {
              this.animateMessages();
            } else {
              this.showExploreButton = true;
              gsap.from('.explore-button', {
                opacity: 0,
                scale: 0.8,
                duration: 1.2,
                ease: 'back.out(2.5)'
              });
            }
          });
        }, 3000);
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
    const button = document.querySelector('.floating-button');
    const animateButton = () => {
      gsap.to(button, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          button?.classList.toggle('bottom-right');
          button?.classList.toggle('top-left');
          gsap.to(button, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.in'
          });
        }
      });
    };
    setInterval(animateButton, 5000);
    animateButton();
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
      this.emailError = 'Iltimos, e-pochtangizni kiriting.';
      this.isEmailValid = false;
    } else if (!emailRegex.test(this.newsletterEmail)) {
      this.emailError = 'Iltimos, to‘g‘ri e-pochta manzilini kiriting.';
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
      this.emailError = 'Obuna bo‘lganingiz uchun rahmat!';
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