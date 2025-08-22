
import { ContactForm } from '@/components/contact-form';

const speakingText = `I regularly give talks at conferences and user groups around the world. It is one of my favorite activities. I believe in this movement, and I want it spread as far and wide as possible. In my talks, I combine practical insights with wry humor, and I am well-known on the conference circuit as an entertaining and educational speaker.

Whether it’s for 10 people in a user group, or 500 at a major conference, I am interested in getting the chance to discuss ideas. I do not have a firm speaker fee, but instead work with organizers to find the way to make it happen.

If you’re interested in a session, it starts with you inviting me. Just drop me an email here and we can start the conversation today!`;

const paragraphs = speakingText.split('\n\n');

export default function SpeakingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Video Embed Section */}
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-md"
            src="https://www.youtube.com/embed/lHoOUylvfxQ" // Placeholder Video
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Content Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-heading">Speaking Events & Keynotes</h1>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/80 leading-relaxed">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Contact Form Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-6 font-heading">Inquire About Speaking</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
