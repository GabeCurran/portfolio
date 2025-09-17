import TypingIntro from "../components/TypingIntro";
import RevealCover from "../components/RevealCover";
import DeferredHomeSections from "../components/DeferredHomeSections";

export default function Home() {
  return (
    <>
  <div className="mx-auto sectionContainer mt-6" id="home">
        <TypingIntro />
        <RevealCover />
      </div>
      <DeferredHomeSections />
    </>
  );
}
