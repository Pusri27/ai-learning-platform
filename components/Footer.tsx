import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-indigo-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Product */}
                    <div>
                        <h3 className="font-mono text-sm font-bold mb-4 text-black dark:text-white">[PRODUCT]</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard/courses" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/tutor" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    AI Tutor
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/progress" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Progress
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-mono text-sm font-bold mb-4 text-black dark:text-white">[COMPANY]</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-mono text-sm font-bold mb-4 text-black dark:text-white">[RESOURCES]</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-mono text-sm font-bold mb-4 text-black dark:text-white">[LEGAL]</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/#" className="font-body text-sm text-black dark:text-white hover:text-primary-500 transition-colors">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t-3 border-black dark:border-white pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 font-mono font-bold text-sm">
                            <div className="w-6 h-6 bg-black dark:bg-white flex items-center justify-center">
                                <span className="text-white dark:text-black text-xs font-bold">AI</span>
                            </div>
                            <span className="text-black dark:text-white">[LEARN]</span>
                        </div>
                        <p className="font-mono text-xs text-black dark:text-white">
                            © {currentYear} AI_LEARN. ALL_RIGHTS_RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
