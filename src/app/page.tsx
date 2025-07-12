export default function Home() {
  return (
    <>
      {/* in the hero section we will use the gradience we have created once */}
      <nav>
        <p className="logo">FrontPage</p>
        <p>Home</p>
        <p>About</p>
        <p>Contact</p>
        <button className="login">Login</button>
      </nav>
      <section className="home">
        {/* when the page is reloaded the underline effect drops by */}
        {/* and this heading will also have an effect of letter zooming when hovered */}
        <div className="heading">
          <p>Learn to trade, at it's finest!</p>
          <div className="hero-buttons">
            <button className="gettingStarted">Get Started</button>
            <button className="faq">Read FAQs</button>
          </div>
        </div>
        {/* <video src="background.mp4" autoPlay muted loop playsInline></video> */}
        <img
          src="https://ik.imagekit.io/tradingmedia/assets/guide/dashboard-20220828.png"
          alt=""
          className="tradedashboard"
        />
      </section>
      <section className="specs">
        {/* a line tale kind of thing getting animated and showing different tabs one side each like a ladder with the features of the app */}
        {/* scroll in to reveal the  heading like before with tag 'experience trading like never (underlined never) before'*/}
        {/* with that entire 'experience trading like never before thing' eventually as we scroll in (scroll-driven animation) just zooming and zooming and fading as well and as we scroll fades away with complete zoom to reveal the app interface  with a caption below  and as we scroll it slides away to the right side to reveal the other features of the app like discussion on stocks having your own predictions and listing them and gaining points for correct one and other all the things in screenshots (figma screenshots of the website) and as user scrolls it slides to the right to reveal the new screenshot with a caption */}
        {/* some more features being listed here */}
      </section>
      <footer>
        {/* [generic footer with gradient background] */}
        <div className="navigation">
          <p>Home</p>
          <p>About</p>
          <p>Contact Us</p>
        </div>
        <div className="socialmedia">
          Follow us on Social Media:
          <p>Instagram</p>
          <p>FaceBook</p>
          <p>Linkedin</p>
        </div>
      </footer>
    </>
  );
}
