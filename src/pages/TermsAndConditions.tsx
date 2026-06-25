
export default function TermsAndConditions() {
    return (
        <div className="public-page-wrapper">
            <div className="public-page-card">
                <h1 className="public-page-title">Terms and Conditions</h1>
                <div className="public-page-content">
                    <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
                    <p>
                        Welcome to Massma! These Terms and Conditions govern your use of the Massma mobile application
                        and any associated services provided by us.
                    </p>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our application, you agree to be bound by these Terms and Conditions.
                        If you disagree with any part of these terms, you may not access the service.
                    </p>
                    <h2>2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide accurate, complete, and current information.
                        Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                    </p>
                    <h2>3. Content</h2>
                    <p>
                        Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post on or through the Service.
                    </p>
                    <h2>4. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
                        including without limitation if you breach the Terms.
                    </p>
                    <h2>5. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide
                        notice before any new terms take effect.
                    </p>
                </div>
            </div>
        </div>
    );
}
