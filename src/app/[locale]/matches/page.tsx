import { redirect } from "next/navigation";

type PageParams = {
  params: {
    locale: string;
  };
};

export default function MatchesPage({ params }: PageParams) {
  redirect(`/${params.locale}/profile`);
}
