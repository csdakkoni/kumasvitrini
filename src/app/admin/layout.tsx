

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if we're on the login page by checking a header trick
    // Since we can't easily check the current path in a layout,
    // we protect individual pages instead
    return <>{children}</>;
}
