import VerifyPageClient from './VerifyPageClient';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const emailParam = params.email;
  const email = Array.isArray(emailParam) ? emailParam[0] ?? '' : emailParam ?? '';

  return <VerifyPageClient email={email} />;
}
