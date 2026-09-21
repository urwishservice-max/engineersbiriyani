import React from 'react';
import { Instagram } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Mr. Pranav",
      role: "FOUNDER",
      image: "/Pi7_Tool_IMG-20231102-WA0023%20(1).jpg",
      insta: "#"
    },
    {
      name: "Mr. Abrar Shariff",
      role: "CO-FOUNDER",
      image: "/IMG20240626124102.jpg",
      insta: "#"
    },
    {
      name: "Mr. Dinesh Kumar",
      role: "CEO",
      image: "/WhatsApp%20Image%202025-05-17%20at%2019.58.23_23657aee.jpg",
      insta: "#"
    },
    {
      name: "Mr. Amjath Ali Khan",
      role: "CFO",
      image: "/IMG_20251207_102134.jpg",
      insta: "#"
    },
    {
      name: "Jaidev Ramakrishna",
      role: "WEB DESIGNER & DEVELOPER",
      image: "/jai.jpg",
      insta: "https://www.instagram.com/urwish.service"
    }
  ];

  const specialThanks = [
    {
      name: "Mr. Yugesh Balaji",
      role: "Logo Designer",
      image: "/WhatsApp%20Image%202025-05-17%20at%2019.58.22_01797664.jpg"
    },
    {
      name: "Mr. Mohamed Aflal",
      role: "Creative NameLord",
      image: "/WhatsApp%20Image%202025-05-17%20at%2019.58.24_a1c8d328.jpg"
    }
  ];

  return (
    <div className="w-full bg-black text-white font-sans min-h-screen pt-28 pb-20 px-4 sm:px-8">
      {/* ABOUT US CARD SECTION (Screenshots 1 & 2) */}
      <section className="max-w-[900px] mx-auto mb-20">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#f5a623] text-center mb-10">
          About Us
        </h1>

        <div className="bg-[#111315] border border-white/10 rounded-[24px] p-8 sm:p-12 space-y-6 text-gray-300 text-left shadow-2xl">
          <h2 className="text-[#f5a623] font-bold text-lg sm:text-xl">
            Crafted with Passion. Delivered with Purpose.
          </h2>

          <p className="leading-relaxed text-sm sm:text-base">
            At Engineer Biryani, we believe that a hearty meal shouldn't come at the cost of your wallet—or the planet. Born out of a simple idea to deliver authentic, flavorful biryani with zero waste and full satisfaction, we serve one goal: to make your Sunday lunch unforgettable.
          </p>

          <p className="leading-relaxed text-sm sm:text-base">
            We operate on a <strong className="text-[#f5a623] font-bold">pre-order only model</strong>, allowing you to book your biryani from Monday to Saturday for a fresh, piping hot delivery every Sunday (Next Delivery: 27-Sep-26). This approach helps us control food waste, maintain quality, and deliver generous portions at affordable prices.
          </p>

          <p className="leading-relaxed text-sm sm:text-base">
            Every biryani packet is designed to serve two people, with:
          </p>

          <ul className="space-y-3 pl-2 text-sm sm:text-base text-white">
            <li className="flex items-center gap-3">
              <span className="text-[#f5a623] font-bold text-base">✓</span>
              <span>Aromatic rice cooked with rich spices</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#f5a623] font-bold text-base">✓</span>
              <span>Two juicy pieces of chicken</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#f5a623] font-bold text-base">✓</span>
              <span>Accompanied by Onion Raita and Kathrika</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#f5a623] font-bold text-base">✓</span>
              <span>Free doorstep delivery</span>
            </li>
          </ul>

          <p className="leading-relaxed text-sm sm:text-base">
            We're not just serving food—we're building a community of biryani lovers who appreciate taste, quantity, and value. Whether you're a student, a working professional, or a family craving a special Sunday meal, Engineer Biryani has something special for you.
          </p>

          <p className="leading-relaxed text-sm sm:text-base">
            Why <strong className="text-[#f5a623] font-bold">"Engineer Biryani"</strong>? Because like every great engineering solution, our model is smart, efficient, and built to serve.
          </p>

          <p className="font-bold text-white text-base sm:text-lg pt-2">
            Pre-order once, enjoy twice the flavor. That's our promise.
          </p>
        </div>
      </section>

      {/* MEET OUR TEAM SECTION (Screenshot 3) */}
      <section className="max-w-[1250px] mx-auto mb-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-[#111315] border border-white/10 rounded-[20px] p-6 text-center flex flex-col items-center justify-between shadow-xl hover:-translate-y-1 transition-transform">
              <div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-28 h-28 rounded-full border-2 border-[#f5a623] object-cover mx-auto mb-4 shadow-md"
                />
                <h3 className="font-bold text-white text-base mb-1">
                  {member.name}
                </h3>
                <p className="text-[#f5a623] font-bold text-[11px] tracking-wider uppercase mb-4">
                  {member.role}
                </p>
              </div>
              <a href={member.insta} target="_blank" rel="noopener noreferrer" className="text-[#f5a623] hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIAL THANKS SECTION (Screenshot 4 - Image 2 match) */}
      <section className="max-w-[800px] mx-auto mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          Special Thanks
        </h2>

        <div className="flex flex-wrap justify-center gap-12 text-center">
          {specialThanks.map((person, i) => (
            <div key={i} className="flex flex-col items-center">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-24 h-24 rounded-full border-2 border-[#f5a623] object-cover mb-3 shadow-md"
              />
              <h4 className="font-bold text-[#f5a623] text-sm mb-1">
                {person.name}
              </h4>
              <p className="text-gray-400 text-xs">
                {person.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
