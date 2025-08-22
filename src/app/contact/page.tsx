import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-heading">Contact Us</h1>
          <p className="text-muted-foreground mt-4">
            Have questions or want to get in touch? Fill out the form below.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
