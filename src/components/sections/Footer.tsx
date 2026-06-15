"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';
import { Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  const { lang } = useLanguageContext();
  const t = translations[lang];

  return (
    <footer className="bg-white border-t py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-black text-primary mb-6">MDMAK HOME</div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {lang === 'ar' 
                ? 'مدمك هوم هو سوقك الرقمي الموثوق لكل ما يتعلق بالبناء والترميم في المملكة العربية السعودية.'
                : 'MDMAK Home is your trusted digital marketplace for everything related to construction and renovation in Saudi Arabia.'}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">{t.footer.about}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">قصتنا</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">الوظائف</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">المدونة</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">{t.footer.links}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">{t.nav.products}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t.nav.contractors}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">الشروط والأحكام</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>support@mdmak.sa</li>
              <li>+966 92000 XXXX</li>
              <li>الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-accent">سياسة الخصوصية</a>
            <a href="#" className="hover:text-accent">اتفاقية الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
