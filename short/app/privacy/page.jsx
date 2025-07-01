const config = {
    websiteName: "URL Shortener",
    websiteUrl: "https://url.editid.uk",
    contactEmail: "contact@dfarkas.uk",
    effectiveDate: "2nd July 2025",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy for {config.websiteName}</h1>
            <p className="text-gray-600 mb-6">Effective Date: {config.effectiveDate}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
                <p>
                    Welcome to {config.websiteName}. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service ("Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
                <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
                <h3 className="text-xl font-semibold mb-2 ml-4">a. Information You Provide to Us</h3>
                <p className="ml-4 mb-4">
                    We collect information you provide directly to us. For example, we collect the original long URL you wish to shorten. If you create an account, we may also collect your email address and password.
                </p>
                <h3 className="text-xl font-semibold mb-2 ml-4">b. Information We Collect Automatically</h3>
                <p className="ml-4">
                    When you use our Service, we automatically collect certain information, including:
                </p>
                <ul className="list-disc ml-10">
                    <li><strong>Log and Usage Data:</strong> We log information when you access and use the Service. This information may include your IP address, browser type, operating system, the referring web page, pages visited, and the dates/times of your access.</li>
                    <li><strong>Click Data:</strong> When someone clicks on a shortened link, we collect information about the click, such as the user agent, and the timestamp.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
                <p>
                    We use the information we collect to:
                </p>
                <ul className="list-disc ml-6">
                    <li>Provide, operate, and maintain our Service.</li>
                    <li>Analyse usage to improve and personalise the Service.</li>
                    <li>Prevent abuse, spam, and other fraudulent or illegal activities.</li>
                    <li>Comply with legal obligations.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">4. Sharing Your Information</h2>
                <p>
                    We do not sell, trade, rent, or otherwise share your personal information for marketing purposes. We may share information with third-party vendors and service providers that perform services for us (e.g., hosting providers), but we require them to maintain the confidentiality of your information.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">6. Children's Privacy</h2>
                <p>
                    Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: <a href={`mailto:${config.contactEmail}`} className="text-blue-600 hover:underline">{config.contactEmail}</a>.
                </p>
            </section>
        </div>
    );
}