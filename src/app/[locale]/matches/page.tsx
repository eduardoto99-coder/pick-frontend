import { redirect } from "next/navigation";

type PageParams = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function MatchesPage({ params }: PageParams) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.locale}/profile`);
}
