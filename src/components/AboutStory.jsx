export default function AboutStory() {
  return (
    <section className="bg-blue-50 py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* የፎቶው ክፍል (በግራ) */}
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1550614000-4b95d4ebf04f?q=80&w=800&auto=format&fit=crop" 
            alt="Our Story" 
            className="w-full h-auto object-cover shadow-lg"
          />
        </div>

        {/* የጽሁፍ ክፍል (በቀኝ) */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story: Crafting Timeless Fashion</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            With years of experience in the tailoring industry, Eyu Tailor blends modern techniques with traditional craftsmanship. Our team of skilled artisans is dedicated to delivering high-quality custom wear. We believe in detail, ensuring every stitch fits perfectly to match your unique style.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}