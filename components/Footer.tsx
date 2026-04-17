import Image from "next/image";

export default function Footer() {
  return (
  <footer id="contact" className="flex flex-col items-center justify-center mt-12 pb-10 gap-4">
      <div className="flex items-center justify-center gap-6 mb-8 sm:mb-0">
        <a target="_blank" rel="noreferrer" href="https://github.com/GabeCurran/" aria-label="GitHub">
          <div className="h-12 w-12 sm:h-16 sm:w-16">
            <Image alt="GitHub" src="/img/githubLight64.png" width={64} height={64} className="transition-transform hover:scale-110" />
          </div>
        </a>
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/gabe-curran/" aria-label="LinkedIn">
          <div className="h-12 w-12 sm:h-16 sm:w-16">
            <Image alt="LinkedIn" src="/img/lnBugWhite.png" width={64} height={64} className="transition-transform hover:scale-110" />
          </div>
        </a>
        <a target="_blank" rel="noreferrer" href="https://www.instagram.com/gabe_curran/" aria-label="Instagram">
          <div className="h-12 w-12 sm:h-16 sm:w-16">
            <Image alt="Instagram" src="/img/instagram.png" width={64} height={64} className="transition-transform hover:scale-110" />
          </div>
        </a>
        <a target="_blank" rel="noreferrer" href="mailto:gabecurran01@gmail.com" aria-label="Email">
          <div className="h-12 w-12 sm:h-16 sm:w-16">
            <Image alt="Gmail" src="/img/gmail64.png" width={64} height={64} className="transition-transform hover:scale-110" />
          </div>
        </a>
      </div>
    </footer>
  );
}
