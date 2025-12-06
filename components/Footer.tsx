export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} AI Learning Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
