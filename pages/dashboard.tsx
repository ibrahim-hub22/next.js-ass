import { auth } from "@/lid/auth";
import { GetServerSideProps } from "next";

export default function Dashboard({ user }: { user: any }) {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Welcome {user?.email}</h2>
      <form method="post" action="/api/auth/signout">
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({
    headers: ctx.req.headers as Record<string, string>,
  });

  if (!session) {
    return {
      redirect: { destination: "/signin", permanent: false },
    };
  }

  return { props: { user: session.user } };
};
