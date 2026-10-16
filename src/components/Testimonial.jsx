export default function Testimonial() {
  return (
    <section className="bg-[#1a1512] text-white py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-xl md:text-2xl font-light mb-10 leading-relaxed">
          "Eyu Tailor transformed my ideas into a stunning outfit. The attention to detail and craftsmanship are truly exceptional. Highly recommend!"
        </p>
        
        {/* የደንበኛው ፎቶ እና ስም */}
        <div className="flex flex-col items-center justify-center">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Jane Smith" 
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <span className="text-sm font-medium">Jane Smith</span>
        </div>
      </div>
    </section>
  );
}