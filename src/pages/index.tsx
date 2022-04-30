import Link from 'next/link';

export default function IndexPage() {
  return (
    <div>
      <h1 className="text-6xl">Home</h1>

      <Link href="/auth">
        <a className="btn">Sign in</a>
      </Link>
    </div>
  );
}
