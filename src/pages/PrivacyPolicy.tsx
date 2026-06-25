
export default function PrivacyPolicy() {
    return (
        <div className="public-page-wrapper">
            <div className="public-page-card">
                <h1 className="public-page-title">Privacy Policy</h1>
                <div className="public-page-content">
                    <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
                    <p>
                        Massma ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
                        This Privacy Policy explains how we collect, use, and share information when you use our application.
                    </p>
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as your name, email address, mobile number,
                        and business details (e.g., PAN card, company information) when you register for an account.
                    </p>
                    <h2>2. How We Use Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, communicate with you,
                        and verify your membership in the Massma community.
                    </p>
                    <h2>3. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information against unauthorized access,
                        alteration, disclosure, or destruction.
                    </p>
                    <h2>4. Account Deletion</h2>
                    <p>
                        You have the right to request the deletion of your account and personal data. You can do this by visiting
                        the <a href="/account-deletion" style={{ color: "var(--primary)", textDecoration: "none" }}>Account Deletion</a> page.
                    </p>
                    <h2>5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@massma.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
