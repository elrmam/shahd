import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, CalendarPlus, Check, ChevronDown, Clock3, Copy, Heart, MapPin, Music2, Navigation, Pause, Play, Share2, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { Facebook, MessageCircle } from 'lucide-react';

// Edit the event information here for future invitation models.
const EVENT = {
  groom: 'عبد الرحمن', bride: 'شهد', date: '2026-11-17', time: '20:00',
  venue: 'Lamour Hall', map: 'https://maps.app.goo.gl/gLxx8VWnYwaZJYQEA',
  music: '/music/wedding-song.mp3'
};
const TARGET = new Date(`${EVENT.date}T${EVENT.time}:00+02:00`).getTime();
const images = [
  {src:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85', title:'بداية الحكاية',en:'THE BEGINNING'},
  {src:'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', title:'تفاصيل من الحب',en:'THE DETAILS'},
  {src:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', title:'لحظة لا تُنسى',en:'THE MOMENT'},
  {src:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=85', title:'وعدٌ للأبد',en:'FOREVER'}
];
const pad = n => String(n).padStart(2,'0');
function remaining(){const n=Math.max(0,TARGET-Date.now());return [Math.floor(n/86400000),Math.floor(n/3600000)%24,Math.floor(n/60000)%60,Math.floor(n/1000)%60]}
const escapeICS = s => String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
function downloadCalendar(){
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Abd Elrahman shahd Wedding//AR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:Abd Elrahman-shahd-20261117@wedding','DTSTAMP:20261110T000000Z','DTSTART;TZID=Africa/Cairo:20261117T200000','DTEND;TZID=Africa/Cairo:20261117T230000',`SUMMARY:${escapeICS('زفاف عبد الرحمن وشهد')}`,`LOCATION:${escapeICS(EVENT.venue)}`,`DESCRIPTION:${escapeICS('يسعدنا حضوركم ومشاركتنا فرحتنا. '+EVENT.map)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
 const blob=new Blob([lines],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Abd Elrahman-shahd-wedding.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
export default function App(){
 const [opened,setOpened]=useState(false),[closing,setClosing]=useState(false),[time,setTime]=useState(remaining),[sound,setSound]=useState(true),[audioReady,setAudioReady]=useState(false),[lightbox,setLightbox]=useState(-1),[toast,setToast]=useState(''),[scroll,setScroll]=useState(0);
 const audio=useRef(null),timer=useRef(null);
 useEffect(()=>{const id=setInterval(()=>setTime(remaining()),1000);return()=>clearInterval(id)},[]);
 useEffect(()=>{const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));return()=>obs.disconnect()},[opened]);
 useEffect(()=>{const fn=()=>setScroll(Math.min(100,(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight||1))*100));window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[]);
 useEffect(()=>{if(lightbox<0)return;const fn=e=>{if(e.key==='Escape')setLightbox(-1)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[lightbox]);
 const notify=t=>{setToast(t);clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),3000)};
 const open=()=>{setClosing(true);audio.current?.play().then(()=>setAudioReady(true)).catch(()=>{setSound(false);setAudioReady(false)});setTimeout(()=>{setOpened(true);setClosing(false);window.scrollTo({top:0,behavior:'instant'})},1050)};
 const toggleMusic=async()=>{if(!audio.current)return;if(audio.current.paused){try{await audio.current.play();setSound(true);setAudioReady(true)}catch{notify('أضف الأغنية في public/music/wedding-song.mp3')}}else{audio.current.pause();setSound(false)}};
 const share=async()=>{const data={title:'دعوة زفاف عبد الرحمن وشهد',text:'يشرفنا حضوركم حفل زفاف عبد الرحمن وشهد يوم الثلاثاء 17 نوفمبر 2026 الساعة 8 مساءً في Lamour Hall',url:location.href};if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(location.href);notify('تم نسخ رابط الدعوة')}catch{window.prompt('انسخ رابط الدعوة',location.href)}};
 return <div className="site">
  <audio ref={audio} src={EVENT.music} preload="none" loop onError={()=>setAudioReady(false)}/>
  <div className="scroll-progress" style={{width:`${scroll}%`}}/>
  {!opened&&<div className={`envelope-screen ${closing?'is-opening':''}`}>
    <div className="entry-photo"/><div className="entry-shade"/>
    <div className="entry-particles" aria-hidden="true">{Array.from({length:17},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
    <div className="entry-card">
      <div className="corner corner-tl"/><div className="corner corner-tr"/><div className="corner corner-bl"/><div className="corner corner-br"/>
      <div className="entry-top"><span>THE WEDDING OF</span><span className="entry-diamond">✧</span><span>17 · 11 · 2026</span></div>
      <div className="entry-monogram"><span>A</span><b>&</b><span>S</span></div>
      <p className="entry-small"> بكل الحب، ندعوكم لتشاركونا ليلة من العمر</p>
      <div className="entry-names">عبد الرحمن <span><br/>&</span> شهد</div>
      <div className="entry-divider"><i/>✦<i/></div>
      <p className="entry-message">بعض اللحظات تصبح أجمل حين نعيشها مع من نحب</p>
      <button className="entry-open" onClick={open}><span className="button-sheen"/><Heart size={17}/> افتح الدعوة <ArrowUpRight size={16}/></button>
      <div className="entry-footer">TUESDAY · 8:00 PM · Lamour Hall</div>
    </div>
    <p className="entry-hint">المس الدعوة لتبدأ الحكاية <span>✦</span></p>
    <div className="curtain curtain-left"/><div className="curtain curtain-right"/>
  </div>}
  <main aria-hidden={!opened}>
   <section className="hero" id="top">
     <div className="hero-photo"/><div className="hero-overlay"/>
     <div className="hero-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
     <div className="hero-goldfall" aria-hidden="true">{Array.from({length:34},(_,i)=><i key={i} style={{"--x":`${(i*29+7)%100}%`,"--size":`${3+(i%4)*1.15}px`,"--duration":`${8+(i%7)*1.7}s`,"--delay":`${-(i%11)*1.35}s`,"--drift":`${((i*17)%70)-35}px`,"--spin":`${(i%2?1:-1)*(260+(i%5)*130)}deg`}}/>)}</div>
     <div className="hero-header"><span>بسم الله الرحمن الرحيم</span><span className="hero-flower">✥</span><span>دعوة زفاف</span></div>
     <div className="hero-center"><p className="eyebrow light">TOGETHER, A BEAUTIFUL FOREVER</p><div className="hero-initials">A <b>&</b> S</div><p className="hero-pretitle">بكل الحب والفرح</p><h2>عبد الرحمن <em>&</em> شهد</h2><div className="ornament light-ornament"><i/>♥<i/></div><p className="hero-description">ننتظركم لتشاركونا بداية أجمل حكاية<br/>في ليلة نكتب فيها أول سطور العمر معًا</p><a className="hero-scroll" href="#story">اكتشفوا الحكاية <ArrowDown size={17}/></a></div>
     <div className="hero-bottom"><span>17 NOVEMBER 2026</span><span>Lamour Hall</span><span>08:00 PM</span></div>
   </section>
   <div className="marquee" aria-label="عبد الرحمن وشهد - 17 نوفمبر 2026"><div className="marquee-track">{Array.from({length:4},(_,i)=><span key={i}>Abd Elrahman <b>✦</b> shahd <b>♥</b> 17 NOVEMBER 2026 <b>✦</b> FOREVER STARTS HERE <b>♥</b></span>)}</div></div>
   <section className="story section" id="story"><div className="story-graphic reveal"><div className="story-graphic-inner"><span className="story-small">OUR STORY</span><span className="story-big">&</span><span className="story-script">Together is<br/>a beautiful place<br/>to be.</span><span className="story-flower">✿</span></div></div><div className="story-copy reveal"><p className="eyebrow">CHAPTER ONE · THE BEGINNING</p><h2>ومن الحبّ<br/><span>تبدأ الحكاية</span></h2><div className="short-line"/><p>هناك لحظات لا تشبه غيرها، وأيام تظل محفورة في القلب. وفي ليلة يلتقي فيها الفرح بالحب، نتمنى أن تكونوا معنا لنصنع ذكرى تظل جميلة إلى الأبد.</p><div className="signature">عبد الرحمن <b>♥</b> شهد</div></div></section>
   <section className="quote-section"><div className="quote-image" style={{ backgroundImage: "url('/wedding.png')" }} ></div><div className="quote-shade"/><div className="quote-content reveal"><span>✦</span><p>«ومن بين كل الحكايات،<br/>اخترنا أن نبدأ حكايتنا معًا»</p><small>Abd Elrahman & shahd</small></div></section>
   <section className="countdown-section section" id="countdown"><div className="countdown-heading reveal"><p className="eyebrow">EVERY SECOND BRINGS US CLOSER</p><h2>العد التنازلي <span>لليلة العمر</span></h2><p>كل لحظة تقرّبنا من يوم تكتمل فيه فرحتنا بوجودكم</p></div><div className="count-grid reveal" dir="ltr">{['يوم','ساعة','دقيقة','ثانية'].map((label,i)=><div className="count-box" key={label}><strong key={`${i}-${time[i]}`}>{pad(time[i])}</strong><span>{label}</span></div>)}</div><div className="count-flourish">✧ ───── ♡ ───── ✧</div></section>
   <section className="date-banner"><div className="date-banner-inner reveal"><span>SAVE THE DATE</span><div><b>17</b><i/> <p>NOVEMBER<br/><strong>2026</strong></p></div><span>TUESDAY · 8:00 PM</span></div></section>
   <section className="details-section section" id="details"><div className="section-heading reveal"><p className="eyebrow">THE CELEBRATION</p><h2>تفاصيل <span>ليلتنا</span></h2><div className="ornament"><i/>✦<i/></div><p>يسعدنا أن تكونوا جزءًا من أجمل أيامنا</p></div><div className="details-grid">
    <article className="detail reveal"><div className="detail-index">01</div><div className="detail-icon"><CalendarDays size={26}/></div><small>التاريخ</small><h3>الثلاثاء</h3><strong>17 نوفمبر 2026</strong><span>TUESDAY · JANUARY 04</span></article>
    <article className="detail reveal"><div className="detail-index">02</div><div className="detail-icon"><Clock3 size={26}/></div><small>الوقت</small><h3>الساعة الثامنة</h3><strong>8:00 مساءً</strong><span>EIGHT IN THE EVENING</span></article>
    <article className="detail reveal"><div className="detail-index">03</div><div className="detail-icon"><MapPin size={26}/></div><small>المكان</small><h3>قاعة لامور</h3><strong>نادي فينيسيا</strong><a className="venue-link" href={EVENT.map} target="_blank" rel="noreferrer">افتح الموقع على الخريطة <Navigation size={15}/></a></article>
   </div><div className="action-row reveal"><button className="action primary" onClick={downloadCalendar}><CalendarPlus size={19}/> إضافة إلى التقويم</button><button className="action secondary" onClick={share}><Share2 size={19}/> مشاركة الدعوة</button></div></section>
   <footer className="melovite-footer">
  <div className="footer-decoration">✦</div>

  <p className="footer-credit">
    صُممت بكل حب بواسطة
    <span> MELOVITE </span>
  </p>

  <div className="footer-line">
    <i />
    <span>✦</span>
    <i />
  </div>

  <div className="footer-actions">
    <a
      href="https://www.facebook.com/melovite"
      target="_blank"
      rel="noreferrer"
      className="footer-btn facebook-btn"
    >
      <Facebook size={18} />
      تابعنا على فيسبوك
    </a>

    <a
      href="https://wa.me/201152033177?text=%D8%A7%D8%B1%D9%8A%D8%AF%20%D8%B5%D9%86%D8%B9%20%D8%AF%D8%B9%D9%88%D8%A9%20%D9%84%D9%8A"
      target="_blank"
      rel="noreferrer"
      className="footer-btn create-btn"
    >
      <MessageCircle size={18} />
      اصنع دعوتك
    </a>
  </div>

  <small className="footer-copy">
    © 2026 MELOVITE · Every moment is made with love
  </small>
</footer>
  </main>
  {opened&&<button className={`music-button ${sound&&audioReady?'is-playing':''}`} onClick={toggleMusic} title={sound&&audioReady?'إيقاف الأغنية':'تشغيل الأغنية'} aria-label={sound&&audioReady?'إيقاف الأغنية':'تشغيل الأغنية'}>{sound&&audioReady?<Volume2 size={20}/>:<VolumeX size={20}/>}<span className="music-bars"><i/><i/><i/></span></button>}
  {lightbox>=0&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setLightbox(-1)}><button className="lightbox-close" onClick={()=>setLightbox(-1)} aria-label="إغلاق"><X/></button><img src={images[lightbox].src} alt={images[lightbox].title} onClick={e=>e.stopPropagation()}/><span>{images[lightbox].title}</span></div>}
  {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
 </div>;
}
