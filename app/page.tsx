export const metadata = {
  title: "App",
};

export default function Page() {
  return (
    <>
      <h1>App</h1>
      <nav>
        <a
          href="/users"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go to Users Page
        </a>
        <br />
        <a
          href="/login"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Login
        </a>
      </nav>
    </>
  );
}
