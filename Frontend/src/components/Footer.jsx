export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h5 className="footer-title">Support</h5>
          <ul className="footer-links">
            <li>
              <a href="mailto:info@hotelreservas.com" className="footer-link">
                info@hotelBooking.com
              </a>
            </li>
            <li>
              <a href="tel:+123456789" className="footer-link">
                +54 9 11 9384-0291
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5 className="footer-title">Users</h5>
          <ul className="footer-links">
            <li>
              <a href="/" className="footer-link">
                Hotels
              </a>
            </li>
            <li>
              <a href="/login" className="footer-link">
                Sign In User
              </a>
            </li>
            <li>
              <a href="/register" className="footer-link">
                Sign Up User
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5 className="footer-title">Partners</h5>
          <ul className="footer-links">
            <li>
              <a href="/loginpartner" className="footer-link">
                Sign In Partner
              </a>
            </li>
            <li>
              <a href="/registerpartner" className="footer-link">
                Sign Up Partner
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
