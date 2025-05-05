import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Have questions or want to get in touch? Fill out the form below.
      </p>
      <ContactForm />
    </div>
  );
}
