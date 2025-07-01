export default function ToSPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

            {/* EDIT SECTION: Service Description */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">1. Service Description</h2>
                <p>
                    Our URL shortener service allows users to create shortened URLs that redirect to longer URLs.
                    This service is provided "as is" without warranties of any kind.
                </p>
            </section>

            {/* EDIT SECTION: User Responsibilities */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">2. User Responsibilities</h2>
                <p>
                    By using our service, you agree not to use it for any illegal or unauthorized purposes.
                    You are responsible for all activities that occur under your account.
                </p>
            </section>

            {/* EDIT SECTION: Prohibited Uses */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">3. Prohibited Uses</h2>
                <p>
                    You may not use our service to:
                </p>
                <ul className="list-disc ml-6 mt-2">
                    <li>Distribute malware or harmful content</li>
                    <li>Engage in illegal activities</li>
                    <li>Violate intellectual property rights</li>
                    <li>Create phishing links or engage in fraudulent activities</li>
                    <li>Distribute adult content without proper age verification</li>
                    <li>Spam or engage in abusive behavior</li>
                </ul>
            </section>

            {/* EDIT SECTION: Limitations of Liability */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">4. Limitations of Liability</h2>
                <p>
                    We are not responsible for any content that you shorten links to. We reserve the right
                    to disable any links that violate our terms of service. We are not liable for any damages
                    arising from the use of our service.
                </p>
            </section>

            {/* EDIT SECTION: Data Usage */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">5. Data Usage</h2>
                <p>
                    We collect basic analytics data on link usage. We do not sell personal data to third parties.
                    For more information, please see our Privacy Policy.
                </p>
            </section>

            {/* EDIT SECTION: Termination */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">6. Termination</h2>
                <p>
                    We reserve the right to terminate or suspend access to our service at any time, for any reason,
                    including violations of these Terms of Service.
                </p>
            </section>

            {/* EDIT SECTION: Changes to Terms */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. We will provide notice of significant changes
                    by posting the new Terms of Service on this page.
                </p>
            </section>

            {/* EDIT SECTION: Governing Law */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
                <p>
                    These terms shall be governed by and construed in accordance with the laws of the United Kingdom,
                    without regard to its conflict of law provisions.
                </p>
            </section>

            {/* EDIT SECTION: Footer Information */}
            <div className="mt-8 text-sm text-gray-600">
                <p>Last updated: 2nd July 2025</p>
                <p>If you have any questions about these Terms, please contact us at contact@dfarkas.uk.</p>
            </div>
        </div>
    );
}