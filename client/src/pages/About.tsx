import React from 'react';

const teamData = [
  { name: "Mr. Pranav", title: "Founder", photo: "/Pi7_Tool_IMG-20231102-WA0023 (1).jpg", insta: "#" },
  { name: "Mr. Abrar Shariff", title: "Co-Founder", photo: "/IMG20240626124102.jpg", insta: "#" },
  { name: "Mr. Dinesh Kumar", title: "CEO", photo: "/WhatsApp Image 2025-05-17 at 19.58.23_23657aee.jpg", insta: "#" },
  { name: "Mr. Amjath Ali Khan", title: "CFO", photo: "/IMG_20251207_102134.jpg", insta: "#" },
  { name: "Jaidev Ramakrishna", title: "Web Developer", photo: "/jai.jpg", insta: "https://www.instagram.com/urwish.service?igsh=MWoxamFnc2tieWwzeQ==" }
];

const About = () => {
  return (
    <div className="flex-1 pt-24 pb-16 relative z-10 w-full max-w-7xl mx-auto">
      
      <section className="max-w-3xl mx-auto px-5 text-center mb-24">
        <h2 className="font-serif text-5xl font-normal mb-8 tracking-wide">Our Story</h2>
        <span className="font-serif italic text-2xl text-gray-500 block mb-10">
          "Crafted with Passion. Delivered with Purpose."
        </span>
        
        <p className="text-gray-600 leading-loose mb-8 text-justify" style={{ textAlignLast: 'center' }}>
          At Engineer Biryani, we believe that a hearty meal shouldn't come at the cost of your wallet—or the planet.
          Born out of a simple idea to deliver authentic, flavorful biryani with zero waste and full satisfaction, we serve one goal: to make your Sunday lunch unforgettable.
        </p>
        
        <p className="text-gray-600 leading-loose mb-8 text-justify" style={{ textAlignLast: 'center' }}>
          We operate on a <strong className="text-black font-semibold">pre-order only model</strong>, allowing you to book your biryani from Monday to Saturday for a fresh, piping hot delivery every Sunday.
          This approach helps us control food waste, maintain quality, and deliver generous portions at affordable prices.
        </p>
        
        <ul className="text-left inline-block my-10 space-y-4">
          <li className="text-gray-600 text-[15px] relative pl-8 before:content-['—'] before:absolute before:left-0 before:text-black before:font-bold">
            Aromatic rice cooked with rich spices
          </li>
          <li className="text-gray-600 text-[15px] relative pl-8 before:content-['—'] before:absolute before:left-0 before:text-black before:font-bold">
            Two juicy pieces of chicken
          </li>
          <li className="text-gray-600 text-[15px] relative pl-8 before:content-['—'] before:absolute before:left-0 before:text-black before:font-bold">
            Accompanied by onion raita and pachadi
          </li>
          <li className="text-gray-600 text-[15px] relative pl-8 before:content-['—'] before:absolute before:left-0 before:text-black before:font-bold">
            Free doorstep delivery
          </li>
        </ul>
        
        <p className="text-gray-600 leading-loose text-justify" style={{ textAlignLast: 'center' }}>
          We’re not just serving food—we’re building a community of biryani lovers who appreciate taste, quantity, and value.
          Why "Engineer Biryani"? Because like every great engineering solution, our model is smart, efficient, and built to serve.
        </p>
      </section>

      <section className="bg-gray-50 py-20 px-5 text-center rounded-3xl mx-4">
        <h2 className="font-serif text-4xl font-normal mb-14 tracking-wide">Meet Our Team</h2>
        
        <div className="flex flex-wrap justify-center gap-12 max-w-6xl mx-auto">
          {teamData.map((member, index) => (
            <div key={index} className="w-44 text-center group">
              <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-5 grayscale-[20%] transition duration-400 group-hover:grayscale-0 group-hover:scale-105 shadow-sm">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                />
              </div>
              <h3 className="font-serif text-[19px] font-normal text-gray-900 mb-1">{member.name}</h3>
              <p className="text-[12px] text-gray-500 uppercase tracking-widest">{member.title}</p>
              
              <a href={member.insta} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-gray-400 hover:text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default About;
