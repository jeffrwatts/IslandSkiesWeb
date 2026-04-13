import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Island Skies Astro",
  description:
    "About Island Skies Astro — astrophotography from the Big Island of Hawaii by Jeff Watts.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="article-content">
        <h1 className="text-4xl font-bold text-foreground mb-10">About</h1>

        <p>
          Island Skies Astro is my way of sharing the night sky from the Big
          Island of Hawaii. Astronomy has been an interest of mine since I was
          very young, but moving to Hawaii rekindled it in a way I did not
          expect. Learning about traditional Polynesian celestial navigation
          played a meaningful role in that return. Understanding how navigators
          read the stars to cross thousands of miles of open ocean brought my
          attention back to the sky and made me want to learn more again. Living
          here also means access to some of the best observing conditions on the
          planet. I image from the Mauna Kea Visitor Information Station at
          around 9,200 feet, where the skies are remarkably dark and steady.
          That inspiration and access to world-class skies is what drew me back
          to astronomy, then to astrophotography, and eventually to creating
          this site.
        </p>

        <p>
          The photos you will find here, including nebulae, galaxies, comets,
          the moon, and planets, were all captured from the Big Island. Along
          with the images, I am creating a series of articles that offer more
          context about what you are seeing. My goal is to make these articles
          easily accessible, scientifically accurate, and genuinely interesting.
          I hope this site gives you a place where the images draw you in and
          the explanations make what you&apos;re seeing even more fascinating.
        </p>

        <h2>Equipment</h2>

        <p>
          Both deep sky rigs share an iOptron CEM 40 mount. I swap between them
          depending on the target.
        </p>

        <h3>Deep sky (wide field)</h3>
        <ul>
          <li>Telescope: William Optics Redcat 6.1</li>
          <li>Camera: ZWO ASI 2600MC Pro Duo (imaging + guiding)</li>
          <li>Filters: UV/IR, Optolong L-Extreme</li>
        </ul>

        <h3>Deep sky (long focal length)</h3>
        <ul>
          <li>Telescope: Celestron C8 with f/6.3 focal reducer (1280mm)</li>
          <li>Camera: ZWO ASI 294MC Pro</li>
          <li>Guide camera: ZWO ASI 174 Mini (off-axis guider)</li>
          <li>Filters: UV/IR, Optolong L-Extreme</li>
        </ul>

        <h3>Planetary</h3>
        <ul>
          <li>Telescope: Celestron C8 with 1.5x Sievert Barlow</li>
          <li>Camera: ZWO ASI 678MC</li>
        </ul>

        <h3>Processing</h3>
        <ul>
          <li>Deep sky: PixInsight, Photoshop</li>
          <li>Planetary: FireCapture, AutoStakkert, waveSharp, Photoshop</li>
        </ul>

        <h2>Other Interests</h2>

        <p>
          When I am not photographing the night sky I enjoy exploring the island
          and snorkeling with my wife, which has become one of our favorite ways
          to spend time together. I also practice free diving and appreciate the
          quiet focus it provides. At home I am learning to play slack key
          Hawaiian guitar, and I spend time reading, especially science books
          and science fiction.
        </p>
      </div>
    </main>
  );
}
